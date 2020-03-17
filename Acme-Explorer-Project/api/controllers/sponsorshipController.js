'use strict';

/*---------------Sponsorship----------------------*/
var mongoose = require('mongoose'),
  Sponsorship = mongoose.model('Sponsorships');
  var auth = require('./authController');

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

exports.update_an_sponsorship_v2 = function(req, res) {
  //Check that the user is administrator if it is updating more things than comments and if not: res.status(403); "an access token is valid, but requires more privileges"
  Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId}, req.body, {new: true}, function(err, sponsorship) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        if (sponsorship) {
          if(sponsorship.sponsorId != actor._id) {
              res.status(401).send({ err: dict.get('Unauthorized', lang) })
              return;
          }
        }
        res.status(500).send(err);
      }
    }
    else{
      res.json(sponsorship);
    }
  });
};

exports.change_flat_rate = function(req, res) {
 var currSponsorship = req.body;
  Sponsorship.findById(currSponsorship._id, function(err, sponsorship) {
    sponsorship.update(
        { _id: currSponsorship._id },
        {
          $set: {
            cost: currSponsorship.cost,
          },
        }
    );
  });
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

exports.pay_a_sponsorship = function(req, res) {
    Sponsorship.findOneAndUpdate({_id: req.params.sponsorshipId},  { $set: {"payed": "true" }}, {new: true}, function(err, sponsorship) {
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

exports.delete_an_sponsorship_v2 = function(req, res) {
  //Check if the user is an administrator and if not: res.status(403); "an access token is valid, but requires more privileges"
    Sponsorship.deleteOne({_id: req.params.sponsorshipId}, function(err, sponsorship) {
        if (err){
            res.status(500).send(err);
        }
        else{
          if (sponsorship) {
            if(sponsorship.sponsorId != actor._id) {
                res.status(401).send({ err: dict.get('Unauthorized', lang) })
                return;
            }
          }
            res.json({ message: 'Sponsorship successfully deleted' });
        }
    });
};





