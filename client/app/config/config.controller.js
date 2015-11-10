'use strict';

angular.module('counterApp')
  .controller('ConfigCtrl', function ($scope, $http) {
    $scope.config = [];
    $scope.config.steps = 5;
    $scope.config.timer = 600;

    $scope.$watch('config.steps', function() {
      $http.post('/api/configs', $scope.config);
    });
    $scope.$watch('config.timer', function() {
      $http.post('/api/configs', $scope.config);
    });

    $scope.processForm = function() {
      $http.post('/api/configs', $scope.config);
      initConfig();
    };


    var initConfig = function(){
      $scope.config= {
        timer: '', //Tiempo del cronómetro
        steps: '', //Puntos por pulsación del pulsador
        active: false
      };
      getConfig();
    }

    var getConfig = function(){
      $http.get('/api/configs').success(function(config) {
        $scope.config= config;
      });
    }

    initConfig();


  })
  .config(function($mdThemingProvider) {
    // Configure a dark theme with primary foreground yellow
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('red');
  });

;
