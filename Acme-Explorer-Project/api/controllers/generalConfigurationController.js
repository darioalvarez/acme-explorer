'use strict';


var mongoose = require('mongoose'),
  GeneralConfiguration = mongoose.model('GeneralConfiguration');



  exports.get_general_configuration = function(req, res) {
    GeneralConfiguration.find({}, function(err, generalConfig) {
      if (err){
        res.status(500).send(err);
      }
      else{
        res.json(generalConfig);
      }
    });
  };

  exports.create_general_configuration = function(req, res) {
    //Check that user is an Administratos and if not: res.status(403); "an access token is valid, but requires more privileges"
    var new_config = new GeneralConfiguration(req.body);
    new_config.save(function(err, generalConfiguration) {
      if (err){
        if(err.name=='ValidationError') {
            res.status(422).send(err);
        }
        else{
          res.status(500).send(err);
        }
      }
      else{
        res.json(generalConfiguration);
      }
    });
  };


  exports.update_general_configuration = function (req, res) {
    GeneralConfiguration.findById(req.params.idGeneralConfiguration, function (err, generalConfig) {
        if (err) {
            res.send(err);
        }
        else {
            GeneralConfiguration.findOneAndUpdate({ _id: req.params.idGeneralConfiguration }, req.body, { new: true }, function (err, generalConfig) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(generalConfig);
                }
            });
        }
    });
};