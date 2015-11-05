'use strict';

describe('Controller: GoCtrl', function () {

  // load the controller's module
  beforeEach(module('counterApp'));

  var GoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GoCtrl = $controller('GoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
