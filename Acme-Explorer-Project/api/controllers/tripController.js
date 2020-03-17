'use strict'
const mongoose = require('mongoose'),
    Trip = mongoose.model('Trips');

exports.list_all_trips = function (req, res) {
    //if auth user is ['MANAGER', 'ADMINISTRATOR'], list all trips
    //if auth user is ['EXPLORER','SPONSOR'], list ['PUBLISHED']
    Trip.find({}, function (err, trips) {
        if (err) res.send(err);
        else res.json(trips)
    });
};

exports.create_a_trip = function (req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    var new_trip = new Trip(req.body);

    // calculating the total price as sum of the stages prices
    if (new_trip.stages) {
        new_trip.price = new_trip.stages.map((stage) => {
            return stage.price
        }).reduce((sum, price) => {
            return sum + price;
        });
    }

    new_trip.save(function (err, trip) {
        if (err) {
            if (err.name == 'ValidationError') {
                res.status(422).send(err);
            } else {
                res.status(500).send(err);
            }
        } else res.status(201).send(trip);
    })
};

exports.read_a_trip = function (req, res) {
    Trip.findOne({
        ticker: req.params.tripTicker
    }, function (err, trip) {
        if (err) res.send(err);
        else {
            res.json(trip);
        }
    });
};

exports.delete_a_trip = function (req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //delete trip if it's not published
    Trip.findOne({
        ticker: req.params.tripTicker
    }, function (err, trip) {
        if (!trip) {
            res.status(404).json({
                message: 'Trip does not exists'
            });
        } else {
            Trip.deleteOne({
                ticker: req.params.tripTicker
            }, function (err, delRes) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(delRes.deletedCount);
                }
            });
        }
    });
};

exports.update_a_trip = function update_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //update trip if it's not published
    Trip.findOne({
        ticker: req.params.tripTicker
    }, function (err, trip) {
        var tripUpdated = req.body;
        //calculating the total price as sum of the stages prices
        if (tripUpdated.stages) {
            tripUpdated.price = tripUpdated.stages.map((stage) => {
                return stage.price
            }).reduce((sum, price) => {
                return sum + price;
            });
        }
        Trip.findOneAndUpdate({
            ticker: req.params.tripTicker
        }, tripUpdated, {
            new: true,
            runValidators: true,
            context: 'query'
        }, function (err, trip) {
            if (err) {
                if (err.name == 'ValidationError') {
                    res.status(422).send(err);
                } else {
                    res.status(500).send(err);
                }
            } else {
                res.json(trip);
            }
        });
    });
};

exports.cancel_a_trip = function cancel_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //update trip if it's not published
    Trip.findOne({
        ticker: req.params.tripTicker
    }, function (err, trip) {
        var cancellationReason = req.body.cancellationReason;
        trip.cancellationReason = cancellationReason;
        trip.cancelled = true;
        Trip.findOneAndUpdate({
            ticker: req.params.tripTicker
        }, trip, {
            new: true,
            runValidators: true,
            context: 'query'
        }, function (err, trip) {
            if (err) {
                if (err.name == 'ValidationError') {
                    res.status(422).send(err);
                } else {
                    res.status(500).send(err);
                }
            } else {
                res.json(trip);
            }
        });
    });
};

exports.search_trips = function (req, res) {
    Trip.find({
            $or: [{
                    'ticker': {
                        "$regex": req.params.keyword,
                        "$options": "i"
                    }
                },
                {
                    'title': {
                        "$regex": req.params.keyword,
                        "$options": "i"
                    }
                },
                {
                    'description': {
                        "$regex": req.params.keyword,
                        "$options": "i"
                    }
                }
            ]
        },
        function (err, trips) {
            if (err) res.send(err);
            else res.json(trips)
        });
}
