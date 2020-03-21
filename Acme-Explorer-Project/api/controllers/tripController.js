'use strict'
const mongoose = require('mongoose'),
    Trip = mongoose.model('Trips'),
    Actor = mongoose.model('Actors');

exports.list_all_trips = function (req, res) {
    //if auth user is ['MANAGER', 'ADMINISTRATOR'], list all trips
    //if auth user is ['EXPLORER','SPONSOR'], list ['PUBLISHED']
    Trip.find({}, function (err, trips) {
        if (err) res.send(err);
        else res.json(trips)
    });
};

exports.list_all_trips_v2 = async function (req, res) {
    //if auth user is ['MANAGER', 'ADMINISTRATOR'], list all trips
    //if auth user is ['EXPLORER','SPONSOR'], list ['PUBLISHED']

    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Actor.findById(authenticatedUserId, function (err, actor) {
        if (actor.role.includes("MANAGER") || actor.role.includes("ADMINISTRATOR")) {
            Trip.find({}, function (err, trips) {
                if (err) res.send(err);
                else res.json(trips)
            });
        } else {
            Trip.find({
                'published': true
            }, function (err, trips) {
                if (err) res.send(err);
                else res.json(trips)
            });
        }
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

exports.create_a_trip_v2 = async function (req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Actor.findById(authenticatedUserId, function (err, actor) {
        if (actor.role.includes("MANAGER") || actor.role.includes("ADMINISTRATOR")) {
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
            });
        } else {
            res.status(403).json({
                message: 'Current user has not permission to create a trip.'
            });
        }
    });
};

exports.read_a_trip = function (req, res) {
    Trip.findById(req.params.tripId, function (err, trip) {
        if (err) res.send(err);
        else {
            res.json(trip);
        }
    });
};

exports.delete_a_trip = function (req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    Trip.findById(req.params.tripId, function (err, trip) {
        if (!trip) {
            res.status(404).json({
                message: 'Trip does not exists'
            });
        } else {
            if (trip.published) {
                res.status(403).json({
                    message: 'A trip published can not be deleted'
                });
            } else {
                Trip.deleteOne({
                    _id: req.params.tripId
                }, function (err, delRes) {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(delRes.deletedCount);
                    }
                });
            }
        }
    });
};

exports.delete_a_trip_v2 = async function (req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Actor.findById(authenticatedUserId, function (err, actor) {
        if (actor.role.includes("MANAGER") || actor.role.includes("ADMINISTRATOR")) {
            Trip.findById(req.params.tripId, function (err, trip) {
                if (!trip) {
                    res.status(404).json({
                        message: 'Trip does not exists'
                    });
                } else {
                    if (trip.published) {
                        res.status(403).json({
                            message: 'A trip published can not be deleted'
                        });
                    } else {
                        Trip.deleteOne({
                            _id: req.params.tripId
                        }, function (err, delRes) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.json(delRes.deletedCount);
                            }
                        });
                    }
                }
            });
        } else {
            res.status(403).json({
                message: 'Current user has not permission to delete a trip.'
            });
        }
    });
};

exports.update_a_trip = function update_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    Trip.findById(req.params.tripId, function (err, trip) {
        if (trip.published) {
            res.status(403).json({
                message: 'A trip published can not be deleted'
            });
        } else {
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
                _id: req.params.tripId
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
        }
    });
};

exports.update_a_trip_v2 = async function update_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Actor.findById(authenticatedUserId, function (err, actor) {
        if (actor.role.includes("MANAGER") || actor.role.includes("ADMINISTRATOR")) {
            Trip.findById(req.params.tripId, function (err, trip) {
                if (trip.published) {
                    res.status(403).json({
                        message: 'A trip published can not be deleted'
                    });
                } else {
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
                        _id: req.params.tripId
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
                }
            });
        } else {
            res.status(403).json({
                message: 'Current user has not permission to update a trip.'
            });
        }
    });
};

exports.cancel_a_trip = function cancel_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //update trip if it's not published
    if (!req.body.cancellationReason) {
        res.status(400).send({
            message: 'cancellationReason required!'
        });
    } else {
        Trip.findById(req.params.tripId, function (err, trip) {
            var cancellationReason = req.body.cancellationReason;
            trip.cancellationReason = cancellationReason;
            trip.cancelled = true;
            Trip.findOneAndUpdate({
                _id: req.params.tripId
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
    }

};

exports.cancel_a_trip_v2 = async function cancel_a_trip(req, res) {
    //check auth user is ['MANAGER'], otherwise return 403
    //update trip if it's not published
    var idToken = req.headers['idtoken'];
    var authenticatedUserId = await authController.getUserId(idToken);

    Actor.findById(authenticatedUserId, function (err, actor) {
        if (actor.role.includes("MANAGER") || actor.role.includes("ADMINISTRATOR")) {
            Trip.findById(req.params.tripId, function (err, trip) {
                var cancellationReason = req.body.cancellationReason;
                trip.cancellationReason = cancellationReason;
                trip.cancelled = true;
                Trip.findOneAndUpdate({
                    _id: req.params.tripId
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
        } else {
            res.status(403).json({
                message: 'Current user has not permission to cancel a trip.'
            });
        }
    });
};


exports.publish_a_trip = function (req, res) {
    Trip.findOneAndUpdate({
        _id: req.params.tripId,
        published: false
    }, {
        $set: {
            "published": true
        }
    }, {
        new: true
    }, function (err, trip) {
        if (err) {
            res.status(500).send(err);
        } else if (trip === null || trip.length == 0) {
            res.status(422).send(err = "El trip requerido no existe o ya está publicado");
        } else {
            res.json(trip);
        }
    });
};

exports.unpublish_a_trip = function (req, res) {
    Trip.findOneAndUpdate({
        _id: req.params.tripId,
        published: true
    }, {
        $set: {
            "published": false
        }
    }, {
        new: true
    }, function (err, trip) {
        if (err) {
            res.status(500).send(err);
        } else if (trip === null || trip.length == 0) {
            res.status(422).send(err = "El trip requerido no existe o no está publicado");
        } else {
            res.json(trip);
        }
    });
};


exports.search_trips = function (req, res) {
    var query = {};
    // keyword=searchString
    if (req.query.keyword) {
        console.log("Setting keyword");
        query = {
            $or: [{
                    'ticker': {
                        "$regex": req.query.keyword,
                        "$options": "i"
                    }
                },
                {
                    'title': {
                        "$regex": req.query.keyword,
                        "$options": "i"
                    }
                },
                {
                    'description': {
                        "$regex": req.query.keyword,
                        "$options": "i"
                    }
                }
            ]
        };
    }
    // minPrice=10
    if (req.query.minPrice) {
        query.price = {
            $gte: req.query.minPrice
        };
    }
    // maxPrice=50
    if (req.query.maxPrice) {
        query.price = {
            $lte: req.query.maxPrice
        };
    }


    // minDate=2020-03-01
    if (req.query.minDate) {
        query.startDate = {
            $gte: req.query.minDate
        };
    }
    // maxDate=2020-04-01
    if (req.query.maxDate) {
        query.endDate = {
            $lte: req.query.maxDate
        };
    }

    // limit=10
    var limit = 10;
    if (req.query.pageSize) {
        limit = parseInt(req.query.pageSize);
    }

    // skip=20
    var skip = 0;
    if (req.query.startFrom) {
        skip = parseInt(req.query.startFrom);
    }

    // reverse="false|true"
    var sort = "";
    if (req.query.reverse == "true" && req.query.sortedBy) {
        sort = "-";
    }

    // sortedBy="ticker|title|description|price|startDate|endDate"
    if (req.query.sortedBy) {
        sort += req.query.sortedBy;
    }

    console.log("Query: " + query + " Skip:" + skip + " Limit:" + limit + " Sort:" + sort);
    console.log(query);

    Trip.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(function (err, trips) {
            console.log('Start searching trips');
            if (err) {
                res.send(err);
            } else {
                res.json(trips);
            }
            console.log('End searching trips');
        });
}
