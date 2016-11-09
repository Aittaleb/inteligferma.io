'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  _ = require('lodash'),
  InterventionNature = db.interventionNature;


var getIdForParameters= function(parameters){
  var idKeys = [];
  _.each(parameters,function(item){
    idKeys.push(item.id);
  });

  return idKeys;
}

/**
 * Create a interventionNature
 */
exports.create = function(req, res) {
  req.body.userId = req.user.id;

  InterventionNature.create(req.body).then(function(interventionNature) {
    if (!interventionNature) {
      return res.send('users/signup', {
        errors: 'Could not create the intervention nature'
      });
    } else {
      // add parameter to intervention
      var idKeys = getIdForParameters(req.body.parameters);
      interventionNature.setParameters(idKeys);

      return res.jsonp(interventionNature);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current interventionNature
 */
exports.read = function(req, res) {
  res.json(req.interventionNature);
};

/**
 * Update a intervention
 */
exports.update = function(req, res) {
  var interventionNature = req.interventionNature;
  var updatedAttr = _.clone(req.body);

  //delete the field that you want to protect from change
  updatedAttr = _.omit(updatedAttr,'id','user_id','user');

  interventionNature.updateAttributes(updatedAttr).then(function(interventionNature) {
    // add the parameter to intervention
    var idKeys = getIdForParameters(updatedAttr.parameters);
    interventionNature.setParameters(idKeys);

    res.json(interventionNature);
  }).catch(function(err) {
    console.log(JSON.stringify(err));
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an interventionNature
 */
exports.delete = function(req, res) {
  var interventionNature = req.interventionNature;
  // Find the intervention
  InterventionNature.findById(interventionNature.id).then(function(interventionNature) {
    if (interventionNature) {
      interventionNature.update({deletedAt: Date.now()}).then(function() {
        return res.json(interventionNature);
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
 * List of interventionNatures
 */
exports.list = function(req, res) {
  InterventionNature.findAll({
    include: []
  }).then(function(interventionNatures) {
    if (!interventionNatures) {
      return res.status(404).send({
        message: 'No intervention nature found'
      });
    } else {
      res.json(interventionNatures);
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

  InterventionNature.findAndCountAll({
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

  InterventionNature.update({deletedAt: Date.now()},{ where: {id: {$in: itemsToDelete}}})
    .then(function(updatedRow){
      res.json({deletedRow:updatedRow})
    }).catch(function(err){
      res.status(404).send({message:"can't deleteing items!!"});
    });
}


exports.searchTokenInterventionNatures = function(req,res){
  var startWith = req.params.startWith;
  InterventionNature.findAll({attributes:['id','name'],where:{name: {$ilike:'%'+startWith+'%'}}})
    .then(function(interventionNatures){
      res.json(interventionNatures);
    }).catch(function(err){
      res.json([]);
    });
};


/**
 * Intervention middleware
 */
exports.interventionNatureByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Product is invalid'
    });
  }

  InterventionNature.find({
    where: {
      id: id
    },
    include: [{
      model: db.user, attributes:['id','displayName']
    },
    {
      model: db.parameter,attributes:['id','name','measurementType']
    }
  ]
}).then(function(interventionNature) {
    if (!interventionNature) {
      return res.status(404).send({
        message: 'No intervention nature with that identifier has been found'
      });
    } else {
      req.interventionNature = interventionNature;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};
