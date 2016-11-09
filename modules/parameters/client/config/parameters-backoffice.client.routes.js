(function () {
  'use strict';

  angular
    .module('parameters.backoffice.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.parameters.list', {
        url: '',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/parameters/client/views/backoffice/list-parameters.client.view.html',
            controller: 'ParametersListController',
            controllerAs: 'vm',
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        }
      })
      .state('backoffice.parameters.create', {
        url: '/create',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/parameters/client/views/backoffice/form-parameter.client.view.html',
            controller: 'ParametersController',
            controllerAs: 'vm',
            resolve: {
              parameterResolve: newParameter
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },
      })
      .state('backoffice.parameters.edit', {
        url: '/:parameterId/edit',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/parameters/client/views/backoffice/form-parameter.client.view.html',
            controller: 'ParametersController',
            controllerAs: 'vm',
            resolve: {
              parameterResolve: getParameter
            }
          },
          "sidebar@backoffice":{
            templateUrl: 'modules/core/client/views/sidebar_left.client.view.html',
            controller: 'SidebarController',
            controllerAs: 'vm',
          }
        },
        data: {
          roles: ['admin']
        },

      });
  }

  getParameter.$inject = ['$stateParams', 'ParametersService'];

  function getParameter($stateParams, ParametersService) {
    return ParametersService.get({
      parameterId: $stateParams.parameterId
    }).$promise;
  }

  newParameter.$inject = ['ParametersService'];

  function newParameter(ParametersService) {
    var parameter = new ParametersService();
    parameter.values = [];
    return parameter;
  }
}());
