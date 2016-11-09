"use strict";

module.exports = function(sequelize, DataTypes) {

  var InterventionNature = sequelize.define('interventionNature', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: "Intervention name must be between 1 and 250 characters in length"
        },
      }
    },
    description: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at'
    },
    type:{
      type: DataTypes.STRING,
      allowNull: true
    },
    category:{
      type: DataTypes.STRING,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    },
    deletedAt:{
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
    defaultParamsValue: {
      type: DataTypes.JSON,
      field: 'default_params_value'
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'intervention_natures',
    associate: function(models) {
      InterventionNature.belongsTo(models.user);
      InterventionNature.belongsToMany(models.parameter, {through: 'intervention_nature_parameters'});
    }
  });
  return InterventionNature;
};
