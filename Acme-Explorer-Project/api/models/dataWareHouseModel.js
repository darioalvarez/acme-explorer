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
    type: Object
  },
  //Finder ------------------------------------
  avgPriceFinders: {
    type: Number,
    min: 0
  },
  topKeywordsFinder: [{
      type: Object
  }],
  computationMoment: {
    type: Date,
    default: Date.now
  },
  rebuildPeriod: {
    type: String
  }
}, { strict: false });


const period_enum = ['M01','M02','M03','M04','M05','M06','M07','M08','M09','M10','M11','M12','M13','M14','M15','M16','M17',
    'M18','M19','M20','M21','M22','M23','M24','M25','M26','M27','M28','M29','M30','M31','M32','M33','M34','M35','M36',
    'Y01','Y02','Y03'];

var CubeSchema = new mongoose.Schema({
    explorer: {
        type: Schema.Types.ObjectId,
        required: function(){
            return this.comparisonOperator == null;
        }
    },
    period: {
        type: String,
        required: 'Kindly enter the period of time',
        enum: period_enum
    },
    money:{
        type: Number,
        required: true,
        min: 0
    },
    computationMoment: {
        type: Date,
        default: Date.now
    },
})

DataWareHouseSchema.index({computationMoment: -1});
CubeSchema.index({computationMoment: -1});
CubeSchema.index({period: 'text'});

module.exports.DataWareHouse = mongoose.model('DataWareHouse', DataWareHouseSchema);
module.exports.Cube = mongoose.model('Cube', CubeSchema);