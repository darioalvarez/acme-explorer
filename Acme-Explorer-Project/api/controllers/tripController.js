'use strict'
const mongoose = require('mongoose'),
      Trip = mongoose.model('Trip');

exports.list_all_trips =  function (req, res) {
    //if auth user is ['MANAGER', 'ADMINISTRATOR'], list all trips
    //if auth user is ['EXPLORER','SPONSOR'], list ['PUBLISHED']
    Trip.find({}, function (err, trips) {
        if (err) res.send(err);
        else res.json(trips)
    });
};

exports.create_a_trip = function (req, res) {
    //status to CREATED(by default in schema definition)
    //check auth user is ['MANAGER'], otherwise return 403
    var new_trip = new Trip(req.body);
    //calculating the total price as sum of the stages prices
    new_trip.price = new_trip.stages.map((stage) => {
        return stage.price
    }).reduce((sum, price) => {
        return sum + price;
    });
    new_trip.save(function (err, trip) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            }
            else {
                res.status(500).send(err);
            }
        }
        else res.status(201).send(trip);
    })
};

exports.read_a_trip = function (req, res) {

    Trip.findOne({ _id: req.swagger.params.tripId.value }, function (err, trips) {
        if (err) res.send(err);
        else {
            res.json(trips);
        }
    });
};

exports.delete_a_trip = function (req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //delete trip if it's not published
    Trip.findById({ _id: req.swagger.params.tripId.value }, function (err, trip) {
        if (trip.status != 'PUBLISHED') {
            Trip.deleteOne({ _id: req.swagger.params.tripId.value }, function (err, trip) {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({ message: 'Trip successfully deleted' });
                }
            });
        } else {
            res.status(405).json({ message: 'Delete trip with status PUBLISHED is not allowed' });
        }
    });
};

exports.update_a_trip = function update_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //update trip if it's not published
    Trip.findById({ _id: req.swagger.params.tripId.value}, function (err, trip) {
        if (trip.status != 'PUBLISHED') {
            var tripUpdated = req.body;
            //calculating the total price as sum of the stages prices
            if (tripUpdated.stages) {
                tripUpdated.price = tripUpdated.stages.map((stage) => {
                    return stage.price
                }).reduce((sum, price) => {
                    return sum + price;
                });
            }
            Trip.findOneAndUpdate({ _id: req.swagger.params.tripId.value}, tripUpdated, { new: true, runValidators: true, context: 'query' }, function (err, trip) {
                if (err) {
                    if (err.name == 'ValidationError') {
                        res.status(422).send(err);
                    }
                    else {
                        res.status(500).send(err);
                    }
                }
                else {
                    res.json(trip);
                }
            });
        } else {
            res.status(405).json({ message: 'Update trip with status PUBLISHED is not allowed' });
        }
    });
};

exports.change_status = function (req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //change status to CANCEL if (PUBLISHED and not STARTED) and don't have any accepted application, otherwise return 405
    var new_status = req.query.val;
    Trip.findOneAndUpdate({ _id: req.swagger.params.tripId.value }, { $set: { status: new_status } }, { new: true, runValidators: true }, function (err, trip) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(trip);
        }
    });
};
