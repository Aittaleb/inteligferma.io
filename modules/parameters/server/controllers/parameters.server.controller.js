'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  _ = require('lodash'),
  Parameter = db.parameter;

/**
 * Create a Parameter
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;

  Parameter.create(req.body).then(function(parameter) {
    if (!parameter) {
      return res.send('users/signup', {
        errors: 'Could not create the parameter'
      });
    } else {
      return res.jsonp(parameter);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current Parameter
 */
exports.read = function(req, res) {
  res.json(req.parameter);
};

/**
 * Update a parameter
 */
exports.update = function(req, res) {
  var parameter = req.parameter;
  var updatedAttr = _.clone(req.body);

  //delete the field that you want to protect from change
  updatedAttr = _.omit(updatedAttr,'id','user_id','user');

  parameter.updateAttributes(updatedAttr).then(function(parameter) {
    res.json(parameter);
  }).catch(function(err) {
    console.log(JSON.stringify(err));
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an parameter
 */
exports.delete = function(req, res) {
  var parameter = req.parameter;
  // Find the parameter
  Parameter.findById(parameter.id).then(function(parameter) {
    if (parameter) {
      parameter.update({deletedAt: Date.now()}).then(function() {
        return res.json(parameter);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the activity'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Parameter
 */
exports.list = function(req, res) {
  Parameter.findAll({
    include: []
  }).then(function(parameters) {
    if (!parameters) {
      return res.status(404).send({
        message: 'No parameter found'
      });
    } else {
      res.json(parameters);
    }
  })
  .catch(function(err) {
    res.status(404).send({message:'Error fetching data'});
  });
};

/**
* lazy load from client
*/
exports.lazy= function(req,res){
  var limit= req.query.limit;
  var offset= (req.query.page-1)*limit;
  var column = req.query.order;
  var orderType='ASC';

  if(column.indexOf('-') != -1){
    orderType= 'DESC';
    column= column.replace('-','');
  }

  Parameter.findAndCountAll({
     order: column+' '+orderType,
     offset: offset,
     limit: limit,
     where:{deletedAt:{$eq: null}},
     include:[]
  })
  .then(function(result) {
    res.json(result);
  }).catch(function(err){
    console.log(err);
    if(err)
      res.json({count:0,rows:[]});
  });

};

/**
* delete all item
*/
exports.deleteAll= function(req,res){
  var itemsToDelete= req.body.itemsToDelete;

  Parameter.update({deletedAt: Date.now()},{ where: {id: {$in: itemsToDelete}}})
    .then(function(updatedRow){
      res.json({deletedRow:updatedRow})
    }).catch(function(err){
      res.status(404).send({message:"can't deleteing items!!"});
    });
}


exports.searchTokenParameters = function(req,res){
  var startWith = req.params.startWith;
  Parameter.findAll({attributes:['id','name', 'measurementType'],where:{name: {$ilike:'%'+startWith+'%'}}})
    .then(function(parameters){
      res.json(parameters);
    }).catch(function(err){
      res.json([]);
    });
};


/**
 * parameter middleware
 */
exports.parameterByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Parameter is invalid'
    });
  }

  Parameter.find({
    where: {
      id: id
    },
    include: [{
      model: db.user, attributes:['id','displayName']
    }
  ]
}).then(function(parameter) {
    if (!parameter) {
      return res.status(404).send({
        message: 'No parameter with that identifier has been found'
      });
    } else {
      req.parameter = parameter;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
