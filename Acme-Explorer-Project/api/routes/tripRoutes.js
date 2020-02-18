'use strict';
const express = require('express');

module.exports = function(app) {
  var trips = require('../controllers/tripController');

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

  app.route('/v1/trips/:tripId')
    /**
     * Get trip by id:
     *    RequiredRoles: any
     *
     * @section trips
     * @type get 
     * @url /v1/trips/:tripId
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

    app.route('/v1/trips/:tripId/status')
    /**
     * Change trip status:
     *    RequiredRoles: Manager
     *
     * @section trips
     * @type put 
     * @url /v1/trips
     * @param {string} val // one of this values ['PUBLISHED', 'STARTED', 'ENDED', 'CANCELLED']
    */
    .put(trips.change_status);
};
