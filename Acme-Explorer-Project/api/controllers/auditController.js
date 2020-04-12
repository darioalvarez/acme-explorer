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
  //Check that user is an Audit and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_audit = new Audit(req.body);

  //Comprobar que el Trip está publicado Y no ha empezado Y no está cancelado
  Trip.find({_id:new_audit.trip, published:true,
    cancelled:false, startDate: {$gt:Date.now()}}, function (err, trip) {
    
      if (err) {
        res.status(500).send(err);
      } else {

        if (trip.length > 0) {
          //En este caso, el trip asociado sería correcto y procederíamos con el save
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
        } else {
          //No existe trip que cumpla los requisitos
          res.status((new_audit.trip == undefined) ? 400 : 422).send(err="El trip asociado no cumple los requisitos");
        }

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
  audit.deleteOne({
    _id: req.params.auditId
  }, function(err, audit) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json({ message: 'audit successfully deleted' });
    }
  });
};


exports.list_audits_by_trip = function(req, res) {
  audit.find({trip:req.params.tripId}, function(err, audits) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(audits);
    }
  });
}
