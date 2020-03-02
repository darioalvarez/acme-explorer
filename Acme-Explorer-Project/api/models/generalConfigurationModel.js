'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GeneralConfigurationSchema = new Schema({
    sponsorshipFlatRate: {
      type: Number,
      min: 0,
      required: 'Kindly enter the flat rate'
    },
    finderCachedTime: {
      type: Number,
      min: 3600,
      max: 86400,
      default: 3600,
      required: 'Kindly enter the finder cached time in seconds'
    },
    finderNumResults: {
        type: Number,
        min: 0,
        max: 100,
        default: 10,
        required: 'Kindly enter the finder number of results'
    }
  }, { strict: false });

  module.exports = mongoose.model('GeneralConfiguration', GeneralConfigurationSchema);