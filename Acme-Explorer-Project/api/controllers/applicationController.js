'use strict';


var mongoose = require('mongoose'),
  Application = mongoose.model('Applications'),
  Trip = mongoose.model('Trips');

exports.list_all_applications = function(req, res) {
  Application.find({}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
};

exports.list_all_applications_by_explorer = function(req, res) {
  Application.find({explorer:req.params.actorId}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
}




exports.create_an_application = function(req, res) {
  //Check that user is an Explorer and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_application = new Application(req.body);

  //Comprobar que el Trip está publicado Y no ha empezado Y no está cancelado
  Trip.find({_id:new_application.trip, published:true,
    cancelled:false, startDate: {$gt:Date.now()}}, function (err, trip) {
    
      if (err) {
        res.status(500).send(err);
      } else {

        if (trip.length > 0) {
          //En este caso, el trip asociado sería correcto y procederíamos con el save
          new_application.save(function(err, application) {
            if (err){
              if(err.name=='ValidationError') {
                  res.status(422).send(err);
              }
              else{
                res.status(500).send(err);
              }
            }
            else{
              res.json(application);
            }
          });
        } else {
          //No existe trip que cumpla los requisitos
          res.status((new_application.trip == undefined) ? 400 : 422).send(err="El trip asociado no cumple los requisitos");
        }

    }
  });

};



exports.read_an_application = function(req, res) {
  Application.findById(req.params.applicationId, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
};


exports.update_an_application = function(req, res) {
  //Checks
  //En el PUT se traga los ENUM
  Application.findById(req.params.applicationId, function(err, application) {
    if (err){
      if(err.name=='ValidationError') {
          res.status(422).send(err);
      }
      else{
        res.status(500).send(err);
      }
    }
    else{
      Application.findOneAndUpdate({_id: req.params.applicationId}, req.body, {new: true}, function(err, application) {
          if (err){
            res.status(500).send(err);
          }
          else{
            res.json(application);
          }
        });
      }
  });
};

exports.reject_an_application = function(req, res) {
  //Check that the user is a Manager and if not: res.status(403); "an access token is valid, but requires more privileges"
  console.log("Rejecting application with id: "+req.params.applicationId)
  if (!req.body.rejectedReason) {
    res.status(400).send({message: 'rejectedReason required!'});
  } else {
    Application.findOneAndUpdate({_id: req.params.applicationId, status:"PENDING"},  { $set: {"status": "REJECTED", "rejectedReason":req.body.rejectedReason}}, {new: true}, function(err, application) {
      if (err){
        res.status(500).send(err);
      }
      else if (application === null || application.length == 0){
        res.status(422).send(err="La Application requerida no existe o su estado no es PENDING");
      } else {
        res.json(application);
      }
    });
  }
};


exports.process_an_application = function(req, res) {
  //Check that the user is a Manager and if not: res.status(403); "an access token is valid, but requires more privileges"
  //Check status is PENDING ??
  Application.findOneAndUpdate({_id: req.params.applicationId},  { $set: {"status": "DUE", "paid":false}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
};


exports.pay_an_application = function(req, res) {
  //Check that the user is the application's explorer owner or an Admin and if not: res.status(403); "an access token is valid, but requires more privileges"
  //Check is not paid and status is DUE ??
  Application.findOneAndUpdate({_id: req.params.applicationId},  { $set: {"status": "ACCEPTED", "paid":true}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
};


exports.cancel_an_application = function(req, res) {
  //Check that the user is the application's explorer owner and if not: res.status(403); "an access token is valid, but requires more privileges"
  //Check status is ACCEPTED ??
  Application.findOneAndUpdate({_id: req.params.applicationId},  { $set: {"status": "CANCELLED"}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(application);
    }
  });
};


exports.delete_an_application = function(req, res) {
  //Check status
  //Check user ... and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.deleteOne({
    _id: req.params.applicationId
  }, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json({ message: 'application successfully deleted' });
    }
  });
};
