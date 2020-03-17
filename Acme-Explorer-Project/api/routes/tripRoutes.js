'use strict';
const express = require('express');

module.exports = function (app) {
  var trips = require('../controllers/tripController');
  var applications = require('../controllers/applicationController');
  var authController = require('../controllers/authController');

  app.route('/v1/trips')
    /**
     * Get all trips:
     *    RequiredRoles: any
     *
     * @section trips
     * @type get 
     * @url /v1/trips
     */
    .get(trips.list_all_trips)
    /**
     * Create trip:
     *    RequiredRoles: Manager
     *
     * @section trips
     * @type post 
     * @url /v1/trips
     */
    .post(trips.create_a_trip);

  /**
   * Get results from a search engine
   *    RequiredRoles: None;
   * 
   * @section trips
   * @type get
   * @url /v1/trips/search
   * @param {string} keyword (in ticker, title, or description)
   * @param {string} minPrice
   * @param {string} maxPrice
   * @param {string} minDate
   * @param {string} maxDate
   * @param {string} pageSize (limit)
   * @param {string} startFrom (offset)
   * @param {string} sortedBy (ticker, title, description)
   * @param {string} deleted (true|false)
   * @param {string} reverse (true|false) 
   */
  app.route('/v1/trips/search/:keyword')
    .get(trips.search_trips)


  app.route('/v1/trips/:tripTicker')
    /**
     * Get trip by id:
     *    RequiredRoles: any
     *
     * @section trips
     * @type get 
     * @url /v1/trips/:tripTicker
     */
    .get(trips.read_a_trip)
    /**
     * Update trip if it's not published:
     *    RequiredRoles: Manager
     *
     * @section trips
     * @type put 
     * @url /v1/trips/:tripId
     */
    .put(trips.update_a_trip)
    /**
     * Delete trip if it's not published:
     *    RequiredRoles: Manager
     *
     * @section trips
     * @type delete 
     * @url /v1/trips/:tripId
     */
    .delete(trips.delete_a_trip);



  app.route('/v1/trips/:tripTicker/cancel')
    /**
     * Update trip if it's not published:
     *    RequiredRoles: Manager
     *
     * @section trips
     * @type put 
     * @url /v1/trips/:tripId
     */
    .put(trips.cancel_a_trip);

  app.route('/v1/trips/:tripId/applications')
    .get(applications.list_applications_by_trip);


  app.route('/v2/trips/:tripId/applications')
    .get(authController.verifyUser(['MANAGER']), applications.list_applications_by_trip);
};
