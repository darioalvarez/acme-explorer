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
  
},  { strict: false });

module.exports = mongoose.model('Sponsorships', SponsorshipSchema);
