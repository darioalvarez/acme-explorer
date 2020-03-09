'use strict';

const streamToMongoDB = require('stream-to-mongo-db').streamToMongoDB;
const request = require('request');
const JSONStream = require('JSONStream');
const generate = require('nanoid/generate');
const moment = require('moment');

module.exports.loadActorsFromApi =
    function (mongoose, mongoDBURI, onlyIfEmptyCollection, apiUrl, next) {
        console.log("Starting loading Actors");
        var Actor = mongoose.model('Actors');

        Actor.estimatedDocumentCount({}, function (err, documentCount) {
            if (err) {
                res.send(err);
            } else if (onlyIfEmptyCollection && documentCount > 0) {
                console.log('DB already has ' + documentCount + ' actors.');
                next();
            } else {
                console.log('Empty DB Actors, loading initial data...');
                // where the data will end up
                const outputDBConfig = {
                    dbURL: mongoDBURI,
                    collection: 'actors'
                };
                // create the writable stream
                const writableStream = streamToMongoDB(outputDBConfig);

                // create readable stream and consume it
                request(apiUrl)
                    .pipe(JSONStream.parse('*'))
                    .pipe(writableStream).on('finish', () => {
                        console.log("Finished loading Actors");
                        next();
                    });
            }
        });
    }

module.exports.loadTripsFromApi =
    function (mongoose, mongoDBURI, onlyIfEmptyCollection, apiUrl, next) {
        console.log("Starting loading Trips");
        var Trip = mongoose.model('Trips');
        var Actor = mongoose.model('Actors');

        Trip.estimatedDocumentCount({}, function (err, documentCount) {
            if (err) {
                res.send(err);
            } else if (onlyIfEmptyCollection && documentCount > 0) {
                console.log('DB already has ' + documentCount + ' trips.');
                next();
            } else {
                console.log('Empty DB Trips, loading initial data...');
                // where the data will end up
                const outputDBConfig = {
                    dbURL: mongoDBURI,
                    collection: 'trips'
                };
                // create the writable stream
                const writableStream = streamToMongoDB(outputDBConfig);

                Actor.find({
                    role: "MANAGER"
                }, ['_id'], function (err, managers) {

                    Trip.find({}, ['ticker'], function (err, tickers) {
                        tickers = tickers.map(item => item.ticker);
                        // create readable stream and consume it
                        request(apiUrl)
                            .pipe(JSONStream.parse('*'))
                            .on('data', function (data) {
                                const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                                let now = moment().format("YYMMDD");
                                var tickerCandidate = "",
                                    tickerValid = false;
                                while (!tickerValid) {
                                    let randomletters = generate(alphabet, 4);
                                    tickerCandidate = `${now}-${randomletters}`;
                                    if (tickers.includes(tickerCandidate)) {
                                        console.log("Ticker already exists: " + tickerCandidate);
                                    } else {
                                        tickerValid = true;
                                        tickers.push(tickerCandidate);
                                    }
                                }
                                data.ticker = tickerCandidate;
                                data.manager = managers[Math.floor(Math.random() * managers.length)]._id;
                                data.requirements = data.requirements.map(item => item.requirement);
                            })
                            .pipe(writableStream).on('finish', () => {
                                console.log("Finished loading Trips");
                                next();
                            });
                    });
                });
            }
        });
    }

module.exports.loadApplicationsFromApi =
    function (mongoose, mongoDBURI, onlyIfEmptyCollection, apiUrl, next) {
        console.log("Starting loading Applications");
        var Trip = mongoose.model('Trips');
        var Actor = mongoose.model('Actors');
        var Application = mongoose.model('Applications');

        Application.estimatedDocumentCount({}, function (err, documentCount) {
            if (err) {
                res.send(err);
            } else if (onlyIfEmptyCollection && documentCount > 0) {
                console.log('DB already has ' + documentCount + ' trips.');
                next();
            } else {
                console.log('Empty DB applications, loading initial data...');
                // where the data will end up
                const outputDBConfig = {
                    dbURL: mongoDBURI,
                    collection: 'applications'
                };
                // create the writable stream
                const writableStream = streamToMongoDB(outputDBConfig);

                Actor.find({role: "EXPLORER"}, ['_id'], function (err, explorers) {
                    Trip.find({}, ['_id'], function (err, trips) {
                        // create readable stream and consume it
                        request(apiUrl)
                            .pipe(JSONStream.parse('*'))
                            .on('data', function (data) {
                                // console.log(data);
                                var explorer = explorers[Math.floor(Math.random() * explorers.length)]._id;
                                var trip = trips[Math.floor(Math.random() * trips.length)]._id;
                                data.explorer = explorer;
                                data.trip = trip;
                                data.comments = data.comments.map(item => item.comment);
                            })
                            .pipe(writableStream).on('finish', () => {
                                console.log("Finished loading Applications");
                                next();
                            });
                    });
                });
            }
        });
    }
