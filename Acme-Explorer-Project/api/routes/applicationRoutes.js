'use strict';
module.exports = function(app) {
  var applications = require('../controllers/applicationController');

  /**
   * Get all applications
   *    RequiredRoles: Administrator
   * Post an application 
   *    RequiredRoles: to be an explorer
   *
   * @section applications
   * @type get post
   * @url /v1/applications
  */
  app.route('/v1/applications')
	  .get(applications.list_all_applications)
	  .post(applications.create_an_application);

  /**
   * Put an application.
   *    RequiredRoles: to be the application's creator explorer
   *                   or the trip manager
   * Get an specific application.
   *    RequiredRoles: to be the application's creator explorer
   *                   or the trip manager or an Administrator.
   * 
   * @section applications
   * @type get put delete
   * @url /v1/applications/:applicationId
  */
  app.route('/v1/applications/:applicationId')
    .get(applications.read_an_application)
	  .put(applications.update_an_application);
    //.delete(applications.delete_an_application);
  
  /**
   * Reject an application.
   *    RequiredRoles: Manager
   * 
   * @section applications
   * @type put
   * @url /v1/applications/:applicationId/reject
  */
  app.route('/v1/applications/:applicationId/reject')
    .put(applications.reject_an_application);
};