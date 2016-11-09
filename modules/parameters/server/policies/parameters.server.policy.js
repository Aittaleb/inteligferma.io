'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Products Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/parameters',
      permissions: '*'
    }, {
      resources: '/api/parameters/:parameterId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/parameters',
      permissions: ['get']
    }, {
      resources: '/api/parameters/:parameterId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/parameters',
      permissions: ['get']
    }, {
      resources: '/api/parameters/:parameterId',
      permissions: ['get']
    }]
  },
  {
    roles: ['user','admin','guest'],
    allows: [{
      resources: '/api/lazy/parameters',
      permissions: ['get']
    }]
  },
  {
    roles: ['admin'],
    allows: [{
      resources: '/api/ajax/parameters/delete/all',
      permissions: ['post']
    }]
  },
  {
    roles: ['admin'],
    allows: [{
      resources: '/api/ajax/parameters/startWith/:startWith',
      permissions: ['get']
    }]
  }
]);
};

/**
 * Check If parameter Policy Allows
 */
exports.isAllowed = function (req, res, next) {

  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an parameter is being processed and the current user created it then allow any manipulation
  if (req.parameter && req.user && req.parameter.user && req.parameter.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
