'use strict';

/**
 * Module dependencies
 */
var parametersPolicy = require('../policies/parameters.server.policy'),
  parameters = require('../controllers/parameters.server.controller');

module.exports = function (app) {
  // parameters collection routes
  app.route('/api/parameters').all(parametersPolicy.isAllowed)
    .get(parameters.list)
    .post(parameters.create);

  // Single product routes
  app.route('/api/parameters/:parameterId').all(parametersPolicy.isAllowed)
    .get(parameters.read)
    .put(parameters.update)
    .delete(parameters.delete);

  app.route('/api/ajax/parameters/delete/all').all(parametersPolicy.isAllowed)
    .post(parameters.deleteAll);

  app.route('/api/ajax/parameters/startWith/:startWith').all(parametersPolicy.isAllowed)
    .get(parameters.searchTokenParameters);


  app.route('/api/lazy/parameters').all(parametersPolicy.isAllowed)
    .get(parameters.lazy);

  // Finish by binding the parameter middleware
  app.param('parameterId', parameters.parameterByID);
};
