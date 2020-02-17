'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const moment = require('moment');
const generate = require('nanoid/generate');

const StageSchema = new Schema({
  title: {
      type: String,
      required: 'Kindly enter the stage title'
  },
  description: {
      type: String,
      required: 'Kindly enter the stage description'
  },
  price: {
      type: Number,
      min: 0,
      required: 'Kindly enter the stage price'
  }
});


var TripSchema = new Schema({
  ticker: {
    type: String,
    unique: true,
    required: 'Kindly enter the trip ticker'
  },
  title: {
    type: String,
    required: 'Kindly enter the trip title'
  },
  description: {
    type: String,
    required: 'Kindly enter the trip description'
  },
  price: {
    type: Number,
    min: 0
  },
  requirements: [String],
  startDate: {
    type: Date,
    required: true,
    validate: [
      startDateValidator,
      'Start date must be greater than Today date'
    ]
  },
  endDate: {
    type: Date,
    required: true,
    validate: [
      endDateValidator,
      'End date must be greater than Start date'
    ]
  },
  status: {
    type: String,
    enum: ['CREATED', 'PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED'],
    default: 'CREATED'
  },
  stages: [StageSchema],
  cancelled: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String,
    required: 'Kindly enter the trip description'
  },
  published: {
    type: Boolean,
    default: false
  },
}, { strict: false });

TripSchema.pre('save', function(next){
    let trip = this;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let randomletters = generate(alphabet,4);
    let now = moment().format("YYMMDD");
    trip.ticker = `${now}-${randomletters}`;
    next();
});

function endDateValidator(endDate){
    var startDate = this.date_start;
    if(!startDate) //making an update
        startDate = new Date(this.getUpdate().date_start);
    return startDate <= endDate;
}

function startDateValidator(startDate){
    let now = moment();
    return now <= startDate;
}

module.exports = mongoose.model('Trips', TripSchema);
