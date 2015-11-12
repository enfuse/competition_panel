'use strict';


angular.module('counterApp')
  .controller('AdminCtrl', function ($scope, $http, Upload, $timeout) {
    $scope.participantes = [];

    /*$scope.upload = function (dataUrl) {

    }*/

    $scope.processForm = function(dataUrl) {
      Upload.upload({
        url: 'http://localhost:9000/uploads',
        data: {
          file: Upload.dataUrltoBlob(dataUrl)
        },
      }).then(function (response) {
        $timeout(function () {
          $scope.result = response.data;
          $scope.participante.photo= response.data[0].path;
          $http.post('/api/participantes', $scope.participante);
        });
      }, function (response) {

        if (response.status > 0) $scope.errorMsg = response.status
          + ': ' + response.data;
      }, function (evt) {
        $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      });

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

