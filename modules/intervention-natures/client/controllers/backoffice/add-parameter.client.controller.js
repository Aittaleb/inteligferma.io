(function () {
  'use strict';

  angular
    .module('interventionNatures.backoffice')
    .controller('AddParameterController', AddParameterController);

  AddParameterController.$inject = ['$scope', '$state', '$mdDialog', '$http'];

  function AddParameterController($scope, $state, $mdDialog, $http){
    var dialog = this;

    dialog.param = undefined;
    dialog.error = null;
    dialog.form = {};
    dialog.cancel = cancel;
    dialog.save = save;
    dialog.hide = hide;

    dialog.searchParam    = null;
    dialog.paramSearch    = paramSearch;

    dialog.paramChange    = paramChange;

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for parameters...
     * remote dataservice call.
     */
    function paramSearch (searchToken) {
      return $http.get('/api/ajax/parameters/startWith/'+searchToken)
        .then(function(res){
          return res.data;
        });
    }

    function paramChange(item){

    }

    function hide(){
      $mdDialog.hide();
    };

    function save(){
      $mdDialog.hide(dialog.param);
    };

    function cancel(){
      $mdDialog.cancel();
    };

  }
}());
