'use strict';

const mongoose = require('mongoose'),
  Audit = mongoose.model('Audits'),
  Trip = mongoose.model('Trips'),
  Actor = mongoose.model('Actors'),
  authController = require('./authController');

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

exports.update_an_audit_v2 = async function update_an_audit(req, res) {
  //check auth user is ['AUDITOR'], otherwise return 403
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  Actor.findById(authenticatedUserId, function (err, actor) {
      if (actor.role.includes("AUDITOR")) {
          Audit.findById(req.params.auditId, function (err, audit) {
            var auditUpdated = req.body;
            Audit.findOneAndUpdate({
                _id: req.params.auditId
            }, auditUpdated, {
                new: true,
                runValidators: true,
                context: 'query'
            }, function (err, audit) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        res.status(422).send(err);
                    } else {
                        res.status(500).send(err);
                    }
                } else {
                    res.json(audit);
                }
            });
        
          });
      } else {
          res.status(403).json({
              message: 'Current user has not permission to update a audit.'
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

exports.delete_an_audit_v2 = async function (req, res) {
  //check auth user is ['AUDITOR'], otherwise return 403
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  Actor.findById(authenticatedUserId, function (err, actor) {
      if (actor.role.includes("AUDITOR")) {
          Audit.findById(req.params.auditId, function (err, audit) {
              if (!audit) {
                  res.status(404).json({
                      message: 'Audit does not exists'
                  });
              } else {
                Audit.deleteOne({
                        _id: req.params.auditId
                    }, function (err, delRes) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.json(delRes.deletedCount);
                        }
                    });
              }
          });
      } else {
          res.status(403).json({
              message: 'Current user has not permission to delete a audit.'
          });
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
