'use strict';

angular.module('counterApp')
  .controller('GoCtrl', function ($rootScope, $scope, $http, $interval) {
    $scope.activeParticipantes = [];
    $scope.config = [];

    $http.get('/api/configs').success(function(config) {
      $scope.config = config;
      $scope.countdown = config.timer;
      $('.vs-reloj-container').countdown({until: '+'+$scope.config.timer,  format: 'M:S', compact: true, }).countdown('toggle');
    });

   /* $scope.updateScopeFromPersistence = function() {
      $http.get('/api/participantes/activos').success(function(activos) {
        //Borro todos los que ya no estén activos
        angular.forEach($scope.activeParticipantes , function(participante, key) {
          var found = $filter('filter')(activos, {_id: participante._id}, true);
          if (found.length == 0) {
            delete $scope.activeParticipantes[key];
          }
        });

        //$scope.activeParticipantes = [];
        angular.forEach(activos, function(participante, key) {
          var found = $filter('filter')(activos, {_id: participante._id}, true);
          if (found.length &&  JSON.stringify(obj1) === JSON.stringify(obj2) ) {

          }else{
            participante.points = 0;
            $scope.activeParticipantes.push(participante);
          }
        });
      });
      //console.table($scope.activeParticipantes);
    }*/


    var handler = function(e){
      switch(e.keyCode){
        case 37: //Right
          $scope.activeParticipantes[0].points=$scope.activeParticipantes[0].points+parseInt($scope.config.steps);
          break;
        case 39: //Left
          $scope.activeParticipantes[1].points=$scope.activeParticipantes[1].points+parseInt($scope.config.steps);
          break;
        case 82: //R
          $('.vs-reloj-container').countdown('toggle');
          break;
        case 38: //Right
          $scope.activeParticipantes[0].points=$scope.activeParticipantes[0].points-parseInt($scope.config.steps);
          break;
        case 40: //Left
          $scope.activeParticipantes[1].points=$scope.activeParticipantes[1].points-parseInt($scope.config.steps);
          break;

      }
      console.log(e.keyCode);
      $scope.$apply();
    };

    var $doc = angular.element(document);
    $doc.on('keyup', handler);
    $scope.$on('$destroy',function(){
      $doc.off('keyup', handler);
    })

    $http.get('/api/participantes/activos').success(function(activos) {;
      angular.forEach(activos, function(participante, key) {
        participante.points = 0;
        $scope.activeParticipantes.push(participante);
      });
    });

  });
