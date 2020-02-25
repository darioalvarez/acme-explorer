'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DataWareHouseSchema = new mongoose.Schema({
    //Trips managed by manager ------------------------------------
  avgTripsByManager: {
    type: Number,
    min: 0
  },
  minTripsByManager: {
    type: Number,
    min: 0
  },
  maxTripsByManager: {
    type: Number,
    min: 0
  },
  standarDeviationTripsByManager: {
    type: Number,
    min: 0
  },
  //Applications per trip ------------------------------------
  avgApplicationsPerTrip: {
    type: Number,
    min: 0
  },
  minApplicationsPerTrip: {
    type: Number,
    min: 0
  },
  maxApplicationsPerTrip: {
    type: Number,
    min: 0
  },
  standarDeviationApplicationsPerTrip: {
    type: Number,
    min: 0
  },
  //Price of trips ------------------------------------
  avgPriceTrips: {
    type: Number,
    min: 0
  },
  minPriceTrips: {
    type: Number,
    min: 0
  },
  maxPriceTrips: {
    type: Number,
    min: 0
  },
  standarDeviationPriceTrips: {
    type: Number,
    min: 0
  },
  //Ratio of applications grouped by status ------------------------------------
  ratioApplicationsByStatus:{
    type: Number,
    max: 1,
    min: 0
  },
  //Finder ------------------------------------
  avgPriceFinders: {
    type: Number,
    min: 0
  },
  topKeywordsFinder: [{
      type: String
  }],
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false });

DataWareHouseSchema.index({ computationMoment: -1 });

module.exports = mongoose.model('DataWareHouse', DataWareHouseSchema);
