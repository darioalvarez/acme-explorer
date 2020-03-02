'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
const ISO6391 = require('iso-639-1')

var CachedTripSchema = new Schema({
  title: {
    type: String,
    required: 'Kindly enter the trip title'
  },
  price: {
    type: Number,
    min: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  cancelled: {
    type: Boolean
  }
}, { strict: false });

var FinderSchema = new Schema({
  keyword: {
    type: String,
    default: null
  },
  minPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  maxPrice: {
    type: Number,
    min: 0,
    default: null
  },
  minDate: {
    type: Date,
    default: null
  },
  maxDate: {
    type: Date,
    default: null,
    validate: [
      maxDateValidator,
      'Max date must be greater than Min date'
    ]
  },
  results: [CachedTripSchema]
}, { strict: false });

var ActorSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the actor name'
  },
  surname: {
    type: String,
    required: 'Kindly enter the actor surname'
  },
  email: {
    type: String,
    required: 'Kindly enter the actor email',
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']    
  },
  password: {
    type: String,
    minlength:5,
    required: 'Kindly enter the actor password'
  },
  preferredLanguage:{
    type : String,
    default : "en",
    validate: [
      iso6391Validator,
      'Preferred Language must match ISO-639-1 codes'
    ]
  },
  phone: {
    type: String,
    match: [/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/, 'Please fill a valid phone number']
  },
  address:{
    type: String
  },
  photo: {
    data: Buffer, contentType: String
  },
  role: [{
    type: String,
    required: 'Kindly enter the user role(s)',
    enum: ['SPONSOR', 'MANAGER', 'EXPLORER', 'ADMINISTRATOR']
  }],
  activated:{
    type: Boolean,
    default: true
  },
  finder: {
    type: FinderSchema,
    default: null
  }
  /*created: {
    type: Date,
    default: Date.now
  }*/
}, { strict: false });

ActorSchema.pre('save', function(callback) {
  var actor = this;
  // Break out if the password hasn't changed
  if (!actor.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(actor.password, salt, function(err, hash) {
      if (err) return callback(err);
      actor.password = hash;
      callback();
    });
  });
});

ActorSchema.methods.verifyPassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
    console.log('verifying password in actorModel: '+password);
    if (err) return cb(err);
    console.log('iMatch: '+isMatch);
    cb(null, isMatch);
  });
};

function maxDateValidator(endDate){
  var minDate = this.minDate;
  if(!minDate) //making an update
      minDate = new Date('2000');
  return minDate <= endDate;
}

function iso6391Validator(prefLang){
  return ISO6391.validate(prefLang);
}

module.exports = mongoose.model('Actors', ActorSchema);