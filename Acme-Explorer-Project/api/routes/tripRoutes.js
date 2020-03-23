'use strict';
const express = require('express');

module.exports = function (app) {
  var trips = require('../controllers/tripController');
  var applications = require('../controllers/applicationController');
  var auth = require('../controllers/authController');
  var sponsorships = require('../controllers/sponsorshipController');


  /**
   * Get all trips:
   *    RequiredRoles: any
   * Create trip:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type get post
   * @url /v1/trips
   */
  app.route('/v1/trips')
    .get(trips.list_all_trips)
    .post(trips.create_a_trip);

  app.route('/v2/trips')
    .get(trips.list_all_trips_v2)
    .post(auth.verifyUser(['MANAGER']), trips.create_a_trip_v2);



  /**
   * Get results from a search engine by keyword
   *    RequiredRoles: None;
   * 
   * @section trips
   * @type get
   * @url /v1/trips/search
   * @param {string} keyword (in ticker, title, or description)
   * @param {string} pageSize (limit)
   * @param {string} startFrom (offset)
   * @param {string} sortedBy (ticker, title, description)
   * @param {string} reverse (true|false) 
   */
  app.route('/v1/trips/search')
    .get(trips.search_trips_by_keyword)

  app.route('/v2/trips/search')
    .get(trips.search_trips_by_keyword)




  /**
   * Search trips by finder criteria
   *    RequiredRoles: Explorer;
   * 
   * @section trips
   * @type get
   * @url /v1/trips/search/finder/:actorId
   */
  app.route('/v1/trips/search/finder/:actorId')
    .get(trips.search_trips_by_finder)

  app.route('/v2/trips/search/finder/:actorId')
    .get(auth.verifyUser(['EXPLORER']), trips.search_trips_by_finder)



  /**
   * Get trip by id:
   *    RequiredRoles: any
   * 
   * Update trip if it's not published:
   *    RequiredRoles: Manager
   * 
   * Delete trip if it's not published:
   *    RequiredRoles: Manager
   * 
   * @section trips
   * @type get put delete
   * @url /v1/trips/:tripId
   */
  app.route('/v1/trips/:tripId')
    .get(trips.read_a_trip)
    .put(trips.update_a_trip)
    .delete(trips.delete_a_trip);


  app.route('/v2/trips/:tripId')
    .get(trips.read_a_trip)
    .put(auth.verifyUser(['MANAGER']), trips.update_a_trip_v2)
    .delete(auth.verifyUser(['MANAGER']), trips.delete_a_trip_v2);



  /**
   * Cancel a trip if it's not published:
   *    RequiredRoles: Manager
   *
   * @section trips
   * @type put 
   * @url /v1/trips/:tripId
   */
  app.route('/v1/trips/:tripId/cancel')
    .put(trips.cancel_a_trip);

  app.route('/v2/trips/:tripId/cancel')
    .put(auth.verifyUser(['MANAGER']), trips.cancel_a_trip_v2);




  app.route('/v1/trips/:tripId/publish')
    .put(trips.publish_a_trip);

  app.route('/v2/trips/:tripId/publish')
    .put(auth.verifyUser(['MANAGER']), trips.publish_a_trip);




  app.route('/v1/trips/:tripId/unpublish')
    .put(trips.unpublish_a_trip);

  app.route('/v2/trips/:tripId/unpublish')
    .put(auth.verifyUser(['MANAGER']), trips.unpublish_a_trip);




  app.route('/v1/trips/:tripId/applications')
    .get(applications.list_applications_by_trip);

  app.route('/v2/trips/:tripId/applications')
    .get(auth.verifyUser(['MANAGER']), applications.list_applications_by_trip);
           


  app.route('/v1/trips/:tripId/randomSponsorship')
    .get(sponsorships.get_random_sponsorship);
    
};
