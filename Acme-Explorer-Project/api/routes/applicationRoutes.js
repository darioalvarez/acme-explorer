'use strict';
module.exports = function(app) {
  var applications = require('../controllers/applicationController');
  var authController = require('../controllers/authController');

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
	  .get(applications.list_all_applications) //endpoint para facilitar desarrollo y pruebas
      .post(applications.create_an_application);
   
    
  app.route('/v2/applications')
  .get(applications.list_all_applications) //endpoint para facilitar desarrollo y pruebas
      .post(authController.verifyUser(['EXPLORER']), applications.create_an_application);



  /**
   * Get an specific application.
   *    RequiredRoles: to be the application's creator explorer
   *                   or the trip manager or an Administrator.
   * 
   * Put an application.
   *    RequiredRoles: to be the application's creator explorer
   *                   or the trip manager
   * 
   * Delete an application. (For making tests easy)
   * @section applications
   * @type get put delete
   * @url /v1/applications/:applicationId
  */
  app.route('/v1/applications/:applicationId')
    .get(applications.read_an_application)
    .put(applications.update_an_application)
    .delete(applications.delete_an_application);

  app.route('/v2/applications/:applicationId')
    .get(applications.read_an_application)
    .put(applications.update_an_application)
    .delete(applications.delete_an_application);
  
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


  app.route('/v2/applications/:applicationId/reject')
      .put(authController.verifyUser(['MANAGER']), applications.reject_an_application);
  
  
  /**
   * Process an application. Set its status to DUE
   *    RequiredRoles: Manager
   * 
   * @section applications
   * @type put
   * @url /v1/applications/:applicationId/process
  */
  app.route('/v1/applications/:applicationId/process')
      .put(applications.process_an_application);

  app.route('/v2/applications/:applicationId/process')
      .put(/*authController.verifyUser(['MANAGER']),*/ applications.process_an_application);
  
  
  /**
   * Pay an application.
   *    RequiredRoles: be the application's explorer owner
   * 
   * @section applications
   * @type put
   * @url /v1/applications/:applicationId/pay
  */
  app.route('/v1/applications/:applicationId/pay')
      .put(applications.pay_an_application);

  app.route('/v2/applications/:applicationId/pay')
      .put(authController.verifyUser(['EXPLORER']), applications.pay_an_application_by_owner);

  /**
   * Cancel an application which is accepted.
   *    RequiredRoles: be the application's explorer owner
   * 
   * @section applications
   * @type put
   * @url /v1/applications/:applicationId/cancel
  */
  app.route('/v1/applications/:applicationId/cancel')
      .put(applications.cancel_an_application);

  app.route('/v2/applications/:applicationId/cancel')
      .put(authController.verifyUser(['EXPLORER']), applications.cancel_an_application_by_owner);
};