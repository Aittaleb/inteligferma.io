(function () {
  'use strict';

  angular
    .module('interventionNatures.backoffice.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('backoffice.interventionNatures.list', {
        url: '',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/intervention-natures/client/views/backoffice/list-intervention-natures.client.view.html',
            controller: 'InterventionNaturesListController',
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
      .state('backoffice.interventionNatures.create', {
        url: '/create',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/intervention-natures/client/views/backoffice/form-intervention-nature.client.view.html',
            controller: 'InterventionNaturesController',
            controllerAs: 'vm',
            resolve: {
              interventionNatureResolve: newInterventionNature
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
      .state('backoffice.interventionNatures.edit', {
        url: '/:interventionNatureId/edit',
        views:{
          "content@backoffice":{
            templateUrl: 'modules/intervention-natures/client/views/backoffice/form-intervention-nature.client.view.html',
            controller: 'InterventionNaturesController',
            controllerAs: 'vm',
            resolve: {
              interventionNatureResolve: getInterventionNature
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

  getInterventionNature.$inject = ['$stateParams', 'InterventionNaturesService'];

  function getInterventionNature($stateParams, InterventionNaturesService) {
    return InterventionNaturesService.get({
      interventionNatureId: $stateParams.interventionNatureId
    }).$promise;
  }

  newInterventionNature.$inject = ['InterventionNaturesService'];

  function newInterventionNature(InterventionNaturesService) {
    var interventionNature = new InterventionNaturesService();
    return interventionNature;
  }
}());
