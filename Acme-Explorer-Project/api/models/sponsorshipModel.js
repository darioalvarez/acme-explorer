'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SponsorshipSchema = new Schema({
  url: {
    type: String,
    required: 'Kindly enter the url',
    lowercase: true,
    match: [/(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/],
  },
  banner: {
    data: Buffer, 
    contentType: String
  },
  paid: {
    type: Boolean,
    default: false
  },
  /*cost: {
    type: Number,
    min: 0,
    required: function() {return this.paid}
  },*/
  sponsor: {
    type: Schema.Types.ObjectId,
    required: 'Sponsor id required',
    ref: 'Actors'
  },
  trip: {
    type: Schema.Types.ObjectId,
    required: 'Trip id required',
    ref: 'Trips'
  }
},  { strict: false });

//Indexes
//SponsorshipSchema.index( { 'url': 1 }, {unique:true} )
//SponsorshipSchema.index( { url: 'text'} )
//SponsorshipSchema.index( { 'cost': 1 }, { sparse: true} )


module.exports = mongoose.model('Sponsorships', SponsorshipSchema);
