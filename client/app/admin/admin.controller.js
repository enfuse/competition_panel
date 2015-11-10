'use strict';


angular.module('counterApp')
  .controller('AdminCtrl', function ($scope, $http, FileUploader) {
    $scope.participantes = [];
    var uploader = $scope.uploader = new FileUploader({
      url: 'upload.php'
    });

    $scope.processForm = function() {
      $http.post('/api/participantes', $scope.participante);
      initParticipante();
    };

    $scope.removeParticipante = function(id){
      $http.delete('/api/participantes/' + id);
      getParticipantes();
    }

    $scope.mostrarParticipante = function(id,mostrar){
      $http.put('/api/participantes/' + id, {'mostrar':mostrar});

      getParticipantes();
    }

    var initParticipante = function(){
      $scope.participante = {
        name: '',
        lastname: '',
        photo: '',
        mostrar: false
      };
      getParticipantes();
    }

    var getParticipantes = function(){
      $http.get('/api/participantes').success(function(participantes) {
        $scope.participantes= participantes;
      });
    }
    //Inicializo el scope para participantes
    initParticipante();
  })

  .config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('red');
  });

