'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  url: {
    type: String,
    required: 'Kindly enter the url'
  },
  banner: {
    data: Buffer, contentType: String
  },
  paid: {
    type: Boolean,
    default: false
  },
  sponsor: {
    type: Schema.Types.ObjectId,
    required: 'Sponsor id required'
  },
  trip: {
    type: Schema.Types.ObjectId,
    required: 'Trip id required'
  }
},  { strict: false });

module.exports = mongoose.model('Sponsorships', SponsorshipSchema);
