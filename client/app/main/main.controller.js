'use strict';

angular.module('counterApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];
    $http.post('/api/participantes', [{'nombre':'jaime garcía', 'edad':'34'}]);
    $http.get('/api/participantes').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

  });
