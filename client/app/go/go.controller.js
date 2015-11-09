'use strict';

angular.module('counterApp')
  .controller('GoCtrl', function ($scope, $http) {
    $scope.activeParticipantes = [];
    var handler = function(e){
      console.log("as");
      switch(e.keyCode){
        case 37:
          $scope.activeParticipantes[0].points=$scope.activeParticipantes[0].points+5;
          break;
        case 39:
          $scope.activeParticipantes[1].points=$scope.activeParticipantes[1].points+5;;
          break;
        /*case 51:
          $scope.activeParticipantes[2].points++;
          break;
        case 52:
          $scope.activeParticipantes[3].points++;
          break;*/
      }

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
