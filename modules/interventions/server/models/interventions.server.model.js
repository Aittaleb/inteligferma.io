"use strict";

module.exports = function(sequelize, DataTypes) {

  var Intervention = sequelize.define('intervention', {
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
    startAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'start_at'
    },
    endAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'end_at'
    },
    deletedAt:{
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
    description: DataTypes.TEXT,
    prescriptionId: {
      type:DataTypes.INTEGER,
      field: 'prescription_id'
    },
    prescriptionNature: {
      type:DataTypes.STRING,
      field: 'prescription_nature'
    },
    paramsValue: {
      type: DataTypes.JSON,
      field: 'params_value'
    },
  }, {
    underscored: true,
    freezeTableName: true,
    tableName: 'interventions',
    associate: function(models) {
      Intervention.belongsTo(models.user);
      Intervention.belongsTo(models.activity);
      Intervention.belongsTo(models.interventionNature);
    }
  });
  return Intervention;
};
