'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AuditSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: 'Kindly enter the title'
  },
  description: {
    type: String,
    required: 'Kindly enter the description'
  },
  attachment: {
    type: Buffer,
    contentType: String
  },
  auditor: {
    type: Schema.Types.ObjectId,
    required: 'Auditor id required',
    ref: 'Actors'
  },
  trip: {
    type: Schema.Types.ObjectId,
    required: 'Trip id required',
    ref: 'Trips'
  }
}, { strict: false });


module.exports = mongoose.model('Audits', AuditSchema);