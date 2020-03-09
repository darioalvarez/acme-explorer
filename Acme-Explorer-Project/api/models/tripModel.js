'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const generate = require('nanoid/generate');
const moment = require('moment');

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
    // required: 'Kindly enter the trip ticker'
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
    default: Date.now,
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
  pictures: [{
    data: Buffer, contentType: String
  }],
  stages: [StageSchema],
  cancelled: {
    type: Boolean,
    default: false
  },
  cancellationReason: {
    type: String
  },
  published: {
    type: Boolean,
    default: false
  },
  manager: {
    type: Schema.Types.ObjectId,
    required: 'Manager id required',
    ref: 'Actors'
  },
}, { strict: false });

TripSchema.pre('save', function(next){
    let trip = this;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let now = moment().format("YYMMDD");

    var tickerCandidate = "";
    var tickerValid = false;

    while(!tickerValid){
      console.log("Ticker not valid: " + tickerCandidate);
      let randomletters = generate(alphabet,4);
      tickerCandidate = `${now}-${randomletters}`;
      console.log("New ticker created: " + tickerCandidate);

      console.log("a");
      // Trip = mongoose.model('Trips');

      // console.log(Trip);

      // Trip.count({ticker: tickerCandidate}, function (err, count){ 
      //   if(count==0){
          tickerValid = true;
      //     console.log("Ticker unique generated!");
      //   }
      //   else{
      //     console.log("c");
      //   }
      // });
    }
    console.log("b");
    trip.ticker = tickerCandidate;
    next();
});

TripSchema.index({ ticker: 1 }, { unique: true });
TripSchema.index({ ticker: 'text', title: 'text', description: 'text' }, 
                 { weights: { ticker: 10, title: 5, description: 1 } });

function startDateValidator(startDate){
  let now = moment();
  return now <= startDate;
}

function endDateValidator(endDate){
    // var startDate = this.date_start;
    // if(!startDate) //making an update
    //     startDate = new Date(this.getUpdate().date_start);
    // return startDate <= endDate;

    let now = moment();
    // return now <= endDate &&  this.ticker != "" ? (endDate > this.getUpdate().startDate) : (endDate > this.startDate);

    return now <= endDate;
}

module.exports = mongoose.model('Trips', TripSchema);
