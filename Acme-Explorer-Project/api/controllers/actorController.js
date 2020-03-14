'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose'),
Actor = mongoose.model('Actors');
var admin = require('firebase-admin');
var authController = require('./authController');


exports.list_all_actors = function(req, res) {
    Actor.find({}, function(err, actors) {
        if (err){
          res.send(err);
        }
        else{
            res.json(actors);
        }
    });
};

exports.create_an_actor = function(req, res) {
  var new_actor = new Actor(req.body);
  
  new_actor.save(function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      res.json(actor);
    }
  });
};

exports.create_an_actor_auth_verified = async function(req, res) {
  var new_actor = new Actor(req.body);
  if (new_actor.role.includes('MANAGER')) {
    var idToken = req.headers['idtoken'];
    if (idToken === null || idToken.length == 0) {
      res.status(403);
      res.send('Para crear un MANAGER hay que estar logado como ADMINISTRATOR');
    } else {
      var authenticatedUserId = await authController.getUserId(idToken);
      Actor.findById(authenticatedUserId, function(err, actor) {
        if (err){
          res.send(err);
        }
        else{
          if (actor.role.includes('ADMINISTRATOR')) {
            new_actor.save(function(err, saved_actor) {
              if (err){
                res.send(err);
              }
              else{
                res.json(saved_actor);
              }
            });
          } else {
            res.status(403);
            res.send('Solo un ADMINISTRATOR puede crear un MANAGER');
          }
        }
      });
    }
    
  } else {
    new_actor.save(function(err, actor) {
      if (err){
        res.send(err);
      }
      else{
        res.json(actor);
      }
    });
  }
  
};



exports.read_an_actor = function(req, res) {
  Actor.findById(req.params.actorId, function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      res.json(actor);
    }
  });
};

exports.update_an_actor = function(req, res) {
    Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
        if (err){
            res.send(err);
        }
        else{
            res.json(actor);
        }
    });
};

exports.delete_an_actor = function(req, res) {
    Actor.deleteOne({_id: req.params.actorId}, function(err, actor) {
        if (err){
            res.send(err);
        }
        else{
            res.json({ message: 'Actor successfully deleted' });
        }
    });
};

exports.ban_an_actor = function(req, res) {
  console.log("Banning an actor with id: "+req.params.actorId)
  Actor.findOneAndUpdate({_id: req.params.actorId}, { $set: {"activated": "false" }}, {new: true}, function(err, actor) {
      if (err){
          res.send(err);
      }
      else{
          res.json(actor);
      }
  });
};

exports.unban_an_actor = function(req, res) {
  console.log("Unbanning an actor with id: "+req.params.actorId)
  Actor.findOneAndUpdate({_id: req.params.actorId}, { $set: {"activated": "true" }}, {new: true}, function(err, actor) {
      if (err){
          res.send(err);
      }
      else{
          res.json(actor);
      }
  });
  
};

exports.login_an_actor = async function(req, res) {
  console.log('starting login an actor');
  var emailParam = req.query.email;
  var password = req.query.password;
  Actor.findOne({ email: emailParam }, function (err, actor) {
      if (err) { res.send(err); }

      // No actor found with that email as username
      else if (!actor) {
        res.status(401); //an access token isn’t provided, or is invalid
        res.json({message: 'forbidden',error: err});
      }

      else if ((actor.role.includes( 'EXPLORER' )) && (actor.activated == false)) {
        res.status(403); //an access token is valid, but requires more privileges
        res.json({message: 'forbidden',error: err});
      }
      else{
        // Make sure the password is correct
        //console.log('En actor Controller pass: '+password);
        actor.verifyPassword(password, async function(err, isMatch) {
          if (err) {
            res.send(err);
          }

          // Password did not match
          else if (!isMatch) {
            //res.send(err);
            res.status(401); //an access token isn’t provided, or is invalid
            res.json({message: 'forbidden',error: err});
          }

          else {
              try{
                var customToken = await admin.auth().createCustomToken(actor.email);
              } catch (error){
                console.log("Error creating custom token:", error);
              }
              actor.customToken = customToken;
              console.log('Login Success... sending JSON with custom token');
              res.json(actor);
          }
      });
    }
  });
};

exports.update_a_verified_actor = function(req, res) {
  console.log('Starting to update the actor...');
  Actor.findById(req.params.actorId, async function(err, actor) {
    if (err){
      res.send(err);
    }
    else{
      console.log('actor: '+actor);
      var idToken = req.headers['idtoken'];//WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      if (actor.role.includes('EXPLORER') || actor.role.includes('MANAGER') || actor.role.includes('SPONSOR')){
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
        } else{
          res.status(403); //Auth error
          res.send('The Actor is trying to update an Actor that is not himself!');
        }    
      } else if (actor.role.includes('ADMINISTRATOR')){
          Actor.findOneAndUpdate({_id: req.params.actorId}, req.body, {new: true}, function(err, actor) {
            if (err){
              res.send(err);
            }
            else{
              res.json(actor);
            }
          });
      } else {
        res.status(405); //Not allowed
        res.send('The Actor has unidentified roles');
      }
    }
  });
  
};
  