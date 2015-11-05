'use strict';

angular.module('counterApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('go', {
        url: '/go',
        templateUrl: 'app/go/go.html',
        controller: 'GoCtrl'
      });
  });