'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ApplicationSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  status: [{
    type: String,
    required: true,
    enum: ['PENDING', 'REJECTED', 'DUE', 'ACCEPTED', 'CANCELLED']
    //default: 'PENDING'
  }],
  rejectedReason: {
    type: String
  },
  comments: [String],
  explorer: {
    type: Schema.Types.ObjectId,
    required: 'Explorer id required'
  },
  trip: {
    type: Schema.Types.ObjectId,
    required: 'Trip id required'
  }
}, { strict: false });


// Execute before each item.save() call
// No me coge el default en el modelo.
ApplicationSchema.pre('save', function(callback) {
  var new_application = this;
  new_application.status = 'PENDING';
  callback();
});


module.exports = mongoose.model('Applications', ApplicationSchema);