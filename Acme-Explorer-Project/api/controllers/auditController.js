'use strict';

var mongoose = require('mongoose'),
  Audit = mongoose.model('Audits'),
  Trip = mongoose.model('Trips');

exports.list_all_audits = function(req, res) {
  Audit.find({}, function(err, audit) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(audit);
    }
  });
};

exports.create_an_audit = function(req, res) {
  var new_audit = new Audit(req.body);
  new_audit.save(function(err, audit) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(audit);
      }
    });
};


exports.read_an_audit = function(req, res) {
  Audit.findById(req.params.auditId, function(err, audit) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(audit);
    }
  });
};


exports.update_an_audit = function(req, res) {

  Audit.findById(req.params.auditId, function(err, audit) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      Audit.findOneAndUpdate({_id: req.params.auditId}, req.body, {new: true}, function(err, audit) {
          if (err){
            res.status(500).send(err);
          }
          else{
            res.json(audit);
          }
        });
      }
  });
};


exports.delete_an_audit = function(req, res) {
  //Check status
  //Check user ... and if not: res.status(403); "an access token is valid, but requires more privileges"
  Audit.deleteOne({_id: req.params.auditId}, function(err, audit) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json({ message: 'audit successfully deleted' });
    }
  });
};


exports.list_audits_by_trip = function(req, res) {
  Audit.find({trip:req.params.tripId}, function(err, audits) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(audits);
    }
  });
}

exports.audits_by_auditor = function(req, res){
  Audit.find({auditor: req.params.auditorId}, function(err, audit) {
    if(err){
        res.status(500).send(err);
    }
    else{
        res.status(200).json(audit);
    }
  });
}
