'use strict';

angular.module('counterApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },{
      'title': 'Participantes',
      'link': '/admin'
    },{
      'title': 'Configuración',
      'link': '/config'
    },{
      'title': 'Panel',
      'link': '/go',
      'target': '_blank'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });