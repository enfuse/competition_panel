'use strict';

angular.module('counterApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('config', {
        url: '/config',
        templateUrl: 'app/config/config.html',
        controller: 'ConfigCtrl'
      });
  });