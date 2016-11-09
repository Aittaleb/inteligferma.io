"use strict";

module.exports = function(sequelize, DataTypes) {

  var Parameter = sequelize.define('parameter', {
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
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
    measurementType: {
      type: DataTypes.ENUM(['length','surface','mass','volume','time','temperature','humidity','none']),
      field: 'measurement_type'
    },
    component: {
      type: DataTypes.ENUM(['number','string','boolean','select','choice','range']),
      field: 'component'
    },
    values: {
      type: DataTypes.JSON,
      field: 'values',
      isArray: true
    },
    defaultValue: {
      type: DataTypes.STRING,
      field: 'default_value'
    },
    defaultUnit: {
      type: DataTypes.STRING,
      field: 'default_unit'
    }
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'parameters',
    associate: function(models) {
      Parameter.belongsTo(models.user);
      Parameter.belongsToMany(models.interventionNature, {through: 'intervention_nature_parameters'});
    }
  });
  return Parameter;
};
