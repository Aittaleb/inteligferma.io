(function () {
  'use strict';

  angular
    .module('interventionNatures.backoffice')
    .controller('InterventionNaturesController', InterventionNaturesController);

  InterventionNaturesController.$inject = ['$scope', '$state', '$window', 'interventionNatureResolve', 'Authentication','$http', '$mdDialog'];

  function InterventionNaturesController($scope, $state, $window, interventionNature, Authentication, $http, $mdDialog) {
    var vm = this;

    vm.interventionNature = interventionNature;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.searchParam    = null;
    vm.paramSearch    = paramSearch;
    vm.selectedParams = [];
    vm.transformChip = transformChip;


    // Remove existing InterventionNature
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.interventionNature.$remove(
          function(res){
            $state.go('backoffice.interventionNatures.list')
          },
          function(err){
            console.log('err intervention nature');
          }
        );

      }
    }

    function save(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.interventionNatureForm');
        return false;
      }

      //vm.interventionNature.parameters = vm.selectedParams;

      //console.log(JSON.stringify(vm.interventionNature));

      // Create a new interventionNature, or update the current instance
      vm.interventionNature.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('backoffice.interventionNatures.list'); // should we send the User to the list or the updated Product's view?
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    /**
     * Search for parameters...
     * remote dataservice call.
     */
    function paramSearch (searchToken) {
      return $http.get('/api/ajax/parameters/startWith/'+searchToken)
        .then(function(res){
          return res.data;
        });
    };

    /**
     * Return the proper object when the append is called.
     */
    function transformChip(chip) {
      // If it is an object, it's already a known chip
      if (angular.isObject(chip)) {
        return chip;
      }

      // Otherwise, create a new one
      return { name: chip, measurementType: 'new' }
    }

    // vm.addParameter = function(ev) {
    //   $mdDialog.show({
    //     controller: 'AddParameterController',
    //     templateUrl: 'modules/intervention-natures/client/views/backoffice/add-parameter.client.view.html',
    //     controllerAs:'dialog',
    //     targetEvent: ev,
    //   })
    //   .then(function(answer) {
    //     $scope.alert = 'You said the information was "' + answer + '".';
    //   }, function() {
    //     $scope.alert = 'You cancelled the dialog.';
    //   });
    // };
  }
}());
