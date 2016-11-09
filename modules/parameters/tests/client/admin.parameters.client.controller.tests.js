(function () {
  'use strict';

  describe('Interventions Controller Tests', function () {
    // Initialize global variables
    var InterventionsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      InterventionsService,
      mockIntervention;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _InterventionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      InterventionsService = _InterventionsService_;

      // create mock intervention
      mockIntervention = new InterventionsService({
        id: 12345,
        name: 'An Article about MEAN',
        description: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Interventions controller.
      InterventionsController = $controller('InterventionsController as vm', {
        $scope: $scope,
        interventionResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleInterventionPostData;

      beforeEach(function () {
        // Create a sample intervention object
        sampleInterventionPostData = new InterventionsService({
          name: 'An Intervention about MEAN',
          description: 'MEAN rocks!'
        });

        $scope.vm.intervention = sampleInterventionPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (InterventionsService) {
        // Set POST response
        $httpBackend.expectPOST('api/interventions', sampleInterventionPostData).respond(mockIntervention);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the intervention was created
        expect($state.go).toHaveBeenCalledWith('admin.interventions.list');
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/interventions', sampleInterventionPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock intervention in $scope
        $scope.vm.intervention = mockIntervention;
      });

      it('should update a valid intervention', inject(function (InterventionsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/interventions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('admin.interventions.list');
      }));

      it('should set $scope.vm.error if error', inject(function (InterventionsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/interventions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup interventions
        $scope.vm.intervention = mockIntervention;
      });

      it('should delete the intervention and redirect to interventions', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/interventions\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('admin.interventions.list');
      });

      it('should should not delete the intervention and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
