'use strict';

/*---------------Sponsorship----------------------*/
var mongoose = require('mongoose'),
  Sponsorship = mongoose.model('Sponsorships');

exports.list_all_sponsorships = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  Sponsorship.find(function(err, sponsorships) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(sponsorships);
    }
  });
};


exports.create_an_sponsorship = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_sponsorship = new Sponsorship(req.body);
  new_sponsorship.save(function(err, sponsorship) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      res.json(sponsorship);
    }
  });
};


exports.change_flat_rate = function(req, res) {
  res.send('Not implemented yet');
};

exports.consult_cube = function(req, res) {
  console.log('Searching an sponsorship depending on params');
  res.send('Not implemented yet');
};


exports.read_an_sponsorship = function(req, res) {
    Sponsorship.findById(req.params.sponsorshipId, function(err, sponsorship) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.json(sponsorship);
      }
    });
};


exports.update_an_sponsorship = function(req, res) {
  //Check that the user is administrator if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new: true}, function(err, sponsorship) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(sponsorship);
      }
    });
};

exports.delete_an_sponsorship = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
    Sponsorship.deleteOne({_id: req.params.sponsorshipId}, function(err, sponsorship) {
        if (err){
            res.status(500).send(err);
        }
        else{
            res.json({ message: 'Sponsorship successfully deleted' });
        }
    });
};





