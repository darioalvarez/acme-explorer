'use strict';
/*---------------ACTOR----------------------*/
var mongoose = require('mongoose');
var Actor = mongoose.model('Actors');
var admin = require('firebase-admin');
var authController = require('./authController');
var bcrypt = require('bcrypt');

exports.list_all_actors = function (req, res) {
  if (req.query.email) {
    Actor.findOne({
      email: req.query.email
    }, function (err, actor) {
      if (err) {
        res.status(500);
        res.send(err);
      } else {
        if (actor) {
          res.json(actor);
        } else {
          res.status(404);
          res.send([])
        }
      }
    });
  } else {
    Actor.find({}, function (err, actors) {
      if (err) {
        res.send(err);
      } else {
        res.json(actors);
      }
    });
  }

};

exports.create_an_actor = function (req, res) {
  var new_actor = new Actor(req.body);

  new_actor.save(function (err, actor) {
    if (err) {
      if (err.code === 11000) {
        res.status(409);
      } else {
        res.status(500);
      }
      res.send(err);
    } else {
      res.json(actor);
    }
  });
};

exports.create_an_actor_auth_verified = async function (req, res) {
  var new_actor = new Actor(req.body);
  if (new_actor.role.includes('MANAGER')) {
    var idToken = req.headers['idToken'];
    console.log('create actor idToken: ', idToken);
    if (idToken) {
      var authenticatedUserId = await authController.getUserId(idToken);
      Actor.findById(authenticatedUserId, function (err, actor) {
        if (err) {
          res.send(err);
        } else {
          if (actor.role.includes('ADMINISTRATOR')) {
            new_actor.save(function (err, saved_actor) {
              if (err) {
                res.send(err);
              } else {
                res.json(saved_actor);
              }
            });
          } else {
            res.status(403);
            res.send('Solo un ADMINISTRATOR puede crear un MANAGER');
          }
        }
      });
    } else {
      res.status(403);
      res.send('Para crear un MANAGER hay que estar logado como ADMINISTRATOR');
    }
  } else {
    new_actor.save(function (err, actor) {
      if (err) {
        if (err.code === 11000) {
          res.status(409);
        } else {
          res.status(500);
        }
        res.send(err);
      } else {
        res.json(actor);
      }
    });
  }
};



exports.read_an_actor = function (req, res) {
  Actor.findById(req.params.actorId, function (err, actor) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      if (actor) {
        res.json(actor);
      } else {
        res.status(404);
        res.send([])
      }

    }
  });
};

exports.get_actor_by_id = async function (idActor) {
  var actor = await Actor.findById(idActor);
  return actor;
};

exports.update_an_actor = function (req, res) {
  console.log('updating actor: ' + JSON.stringify(req.body));

  Actor.findOneAndUpdate({
    _id: req.params.actorId
  }, {
    $set: {
      "name": req.body.name,
      "surname": req.body.surname,
      "preferredLanguage": req.body.preferredLanguage,
      "phone": req.body.phone,
      "address": req.body.address,
      "role": req.body.role,
      "photo": req.body.photo,
    }
  }, {
    new: true
  }, function (err, actor) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      res.json(actor);
    }
  });
};

exports.update_actor_password = function (req, res) {
  console.log('updating password: ' + JSON.stringify(req.body));
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return callback(err);
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      if (err) return callback(err);
      Actor.findOneAndUpdate({
        _id: req.params.actorId
      }, {
        $set: {
          "password": hash
        }
      }, {
        new: true
      }, function (err, actor) {
        if (err) {
          res.status(500);
          res.send(err);
        } else {
          res.json(actor);
        }
      });
    });
  });
}

exports.update_actor_photo = function (req, res) {
  console.log('updating photo: ' + JSON.stringify(req.body));

  Actor.findOneAndUpdate({
    _id: req.params.actorId
  }, {
    $set: {
      "photo": req.body.photo
    }
  }, {
    new: true
  }, function (err, actor) {
    if (err) {
      res.status(500);
      res.send(err);
    } else {
      res.json(actor);
    }
  });
}

//callback();

exports.update_finder_cache = async function (idActor, finder, tripResults) {
  let current_date = new Date();
  if (!finder) {
    finder = {
      "keyword": null,
      "minPrice": 0,
      "maxPrice": null,
      "minDate": null,
      "maxDate": null,
    }
  }

  await Actor.findOneAndUpdate({
    _id: idActor
  }, {
    "finder": {
      "keyword": finder.keyword,
      "minPrice": finder.minPrice,
      "maxPrice": finder.maxPrice,
      "minDate": finder.minDate,
      "maxDate": finder.maxDate,
      "results": tripResults,
      "resultsCachedDate": current_date
    }
  });

};

exports.delete_an_actor = function (req, res) {
  Actor.deleteOne({
    _id: req.params.actorId
  }, function (err, actor) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        message: 'Actor successfully deleted'
      });
    }
  });
};

exports.ban_an_actor = function (req, res) {
  console.log("Banning an actor with id: " + req.params.actorId)
  Actor.findOneAndUpdate({
    _id: req.params.actorId
  }, {
    $set: {
      "activated": "false"
    }
  }, {
    new: true
  }, function (err, actor) {
    if (err) {
      res.send(err);
    } else {
      res.json(actor);
    }
  });
};

exports.unban_an_actor = function (req, res) {
  console.log("Unbanning an actor with id: " + req.params.actorId)
  Actor.findOneAndUpdate({
    _id: req.params.actorId
  }, {
    $set: {
      "activated": "true"
    }
  }, {
    new: true
  }, function (err, actor) {
    if (err) {
      res.send(err);
    } else {
      res.json(actor);
    }
  });

};

exports.login_an_actor = async function (req, res) {
  console.log('starting login an actor');
  var emailParam = req.query.email;
  var password = req.query.password;
  Actor.findOne({
    email: emailParam
  }, function (err, actor) {
    if (err) {
      res.send(err);
    }

    // No actor found with that email as username
    else if (!actor) {
      res.status(401); //an access token isn’t provided, or is invalid
      res.json({
        message: 'forbidden',
        error: err
      });
    } else if ((actor.role.includes('EXPLORER')) && (actor.activated == false)) {
      res.status(403); //an access token is valid, but requires more privileges
      res.json({
        message: 'forbidden',
        error: err
      });
    } else {
      // Make sure the password is correct
      //console.log('En actor Controller pass: '+password);
      actor.verifyPassword(password, async function (err, isMatch) {
        if (err) {
          res.send(err);
        }

        // Password did not match
        else if (!isMatch) {
          //res.send(err);
          res.status(401); //an access token isn’t provided, or is invalid
          res.json({
            message: 'forbidden',
            error: err
          });
        } else {
          try {
            var customToken = await admin.auth().createCustomToken(actor.email);
          } catch (error) {
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

exports.update_a_verified_actor = function (req, res) {
  console.log('Starting to update the actor...');
  Actor.findById(req.params.actorId, async function (err, actor) {
    if (err) {
      res.send(err);
    } else {
      console.log('actor: ' + actor);
      var idToken = req.headers['idtoken']; //WE NEED the FireBase custom token in the req.header['idToken']... it is created by FireBase!!
      if (actor.role.includes('EXPLORER') || 
          actor.role.includes('MANAGER') || 
          actor.role.includes('SPONSOR')  ||
          actor.role.includes('AUDITOR')) {
        var authenticatedUserId = await authController.getUserId(idToken);
        if (authenticatedUserId == req.params.actorId) {
          // Actor.findOneAndUpdate({
          //   _id: req.params.actorId
          // }, req.body, {
          //   new: true
          // }, function (err, actor) {
          //   if (err) {
          //     res.send(err);
          //   } else {
          //     res.json(actor);
          //   }
          // });

          Actor.findOneAndUpdate({
            _id: req.params.actorId
          }, {
            $set: {
              "name": req.body.name,
              "surname": req.body.surname,
              "preferredLanguage": req.body.preferredLanguage,
              "phone": req.body.phone,
              "address": req.body.address,
              "role": req.body.role,
              "photo": req.body.photo,
            }
          }, {
            new: true
          }, function (err, actor) {
            if (err) {
              res.status(500);
              res.send(err);
            } else {
              res.json(actor);
            }
          });

        } else {
          res.status(403); //Auth error
          res.send('The Actor is trying to update an Actor that is not himself!');
        }
      } else if (actor.role.includes('ADMINISTRATOR')) {
        // Actor.findOneAndUpdate({
        //   _id: req.params.actorId
        // }, req.body, {
        //   new: true
        // }, function (err, actor) {
        //   if (err) {
        //     res.send(err);
        //   } else {
        //     res.json(actor);
        //   }
        // });

        Actor.findOneAndUpdate({
          _id: req.params.actorId
        }, {
          $set: {
            "name": req.body.name,
            "surname": req.body.surname,
            "preferredLanguage": req.body.preferredLanguage,
            "phone": req.body.phone,
            "address": req.body.address,
            "role": req.body.role
          }
        }, {
          new: true
        }, function (err, actor) {
          if (err) {
            res.status(500);
            res.send(err);
          } else {
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
