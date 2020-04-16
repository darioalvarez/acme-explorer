'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ApplicationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    required: true,
    enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED'],
    default: 'PENDING'
  },
  rejectedReason: {
    type: String
  },
  comments: [String],
  paid: {
    type: Boolean,
    default: false
  },
  explorer: {
    type: Schema.Types.ObjectId,
    required: 'Explorer id required',
    ref: 'Actors'
  },
  trip: {
    type: Schema.Types.ObjectId,
    required: 'Trip id required',
    ref: 'Trips'
  },
  trip_name: {
    type: String
  }
}, { strict: false });

ApplicationSchema.index({ trip: 1, status: 1 });
ApplicationSchema.index({ explorer: 1, status: 1 });

// Execute before each item.save() call
// No me coge el default en el modelo.
ApplicationSchema.pre('save', function(callback) {
  var new_application = this;
  new_application.status = 'PENDING';
  new_application.paid = false;
  callback();
});


module.exports = mongoose.model('Applications', ApplicationSchema);