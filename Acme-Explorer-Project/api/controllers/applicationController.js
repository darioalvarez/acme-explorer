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


exports.list_all_applications_by_explorer_grouped_by_status = async function(req, res) {
  let results;
  try {
    results = await Application.aggregate([
      {$match:{explorer: mongoose.Types.ObjectId(req.params.actorId)}},
      {$group:{_id:"$status", applications: { $push: "$$ROOT" }}}
    ]);

    res.json(results);

  } catch (err) {
    res.status(500).send(err);
  }
}




exports.create_an_application = function(req, res) {
  //Check that user is an Explorer and if not: res.status(403); "an access token is valid, but requires more privileges"
  var new_application = new Application(req.body);
  const date = new Date();

  //Comprobar que el Trip está publicado Y no ha empezado Y no está cancelado
  Trip.find({_id:new_application.trip, published:true,
    cancelled:false}, function (err, trip) {
    
      if (err) {
        res.status(500).send(err);
      } else {

        if (trip.length > 0 && date < trip[0].startDate) {
          //En este caso, el trip asociado sería correcto y procederíamos con el save
          new_application.trip_name = trip[0].title;
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
  Application.findOneAndUpdate({_id: req.params.applicationId, status:"PENDING"},  { $set: {"status": "DUE", "paid":false}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else if (application === null || application.length == 0){
      res.status(422).send(err="La Application requerida no existe o su estado no es PENDING");
    } else {
      res.json(application);
    }
  });
};


exports.pay_an_application = function(req, res) {
  //Check that the user is the application's explorer owner or an Admin and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.findOneAndUpdate({_id: req.params.applicationId, paid:false, status:"DUE"},  { $set: {"status": "ACCEPTED", "paid":true}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else if (application === null || application.length == 0){
      res.status(422).send(err="La Application requerida ya está pagada o su estado no es DUE");
    } else {
      res.json(application);
    }
  });
};

exports.pay_an_application_by_owner = async function(req, res) {

  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);
  
  Application.findOneAndUpdate({_id: req.params.applicationId, paid:false, status:"DUE"},  { $set: {"status": "ACCEPTED", "paid":true}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else if (application === null || application.length == 0){
      res.status(422).send(err="La Application requerida ya está pagada o su estado no es DUE");
    } else {
      if (application.actorId == authenticatedUserId) {
        res.json(application);
      } else {
        res.status(403); //Auth error
        res.send('The Actor is trying to pay an Application created by another actor!');
      }
    }
  });
};


exports.cancel_an_application = function(req, res) {
  //Check that the user is the application's explorer owner and if not: res.status(403); "an access token is valid, but requires more privileges"
  Application.findOneAndUpdate({_id: req.params.applicationId, status:"ACCEPTED"},  { $set: {"status": "CANCELLED"}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else if (application === null || application.length == 0){
      res.status(422).send(err="La Application requerida no está aceptada");
    } else {
      res.json(application);
    }
  });
};

exports.cancel_an_application_by_owner = async function(req, res) {
  var idToken = req.headers['idtoken'];
  var authenticatedUserId = await authController.getUserId(idToken);

  Application.findOneAndUpdate({_id: req.params.applicationId, status:"ACCEPTED"},  { $set: {"status": "CANCELLED"}}, {new: true}, function(err, application) {
    if (err){
      res.status(500).send(err);
    }
    else if (application === null || application.length == 0){
      res.status(422).send(err="La Application requerida no está aceptada");
    } else {
      if (application.actorId == authenticatedUserId) {
        res.json(application);
      } else {
        res.status(403); //Auth error
        res.send('The Actor is trying to cancel an Application created by another actor!');
      }
      
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


exports.list_applications_by_trip = function(req, res) {
  Application.find({trip:req.params.tripId}, function(err, applications) {
    if (err){
      res.status(500).send(err);
    }
    else{
      res.json(applications);
    }
  });
}
