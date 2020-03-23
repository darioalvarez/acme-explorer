'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');
  var applications = require('../controllers/applicationController')
  var authController = require('../controllers/authController');

  /**
   * Get all actors
   *    RequiredRoles: None
   * Post an actor: register to the system
   *    RequiredRoles: None
	 *
	 * @section actors
	 * @type get post
	 * @url /v1/actors
   * @param {string} role (administrator|explorer|manager|sponsor) 
  */
  app.route('/v1/actors')
	  .get(actors.list_all_actors)
	  .post(actors.create_an_actor);


  app.route('/v2/actors')
	  .post(actors.create_an_actor_auth_verified);
    
  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
	 * Delete an actor
   *    Not a requirement but for making testing easy
   * 
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
   * @param {string} actorId
  */ 
  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
	  .put(actors.update_an_actor)
    .delete(actors.delete_an_actor);
  

  app.route('/v2/actors/:actorId')
    .get(actors.read_an_actor)
    .put(authController.verifyUser(["ADMINISTRATOR",
                                    "EXPLORER",
                                    "MANAGER",
                                    "SPONSOR"]),actors.update_a_verified_actor)
     

  /**
   * Get applications made by an explorer
   *    RequiredRoles: to be the proper Explorer
	 *
	 * @section actors
	 * @type get
	 * @url /v1/actors/:actorId/applications
   * @param {string} actorId
  */ 
  app.route('/v1/actors/:actorId/applications')
    .get(applications.list_all_applications_by_explorer_grouped_by_status);
  

  app.route('/v2/actors/:actorId/applications')
    .get(authController.verifyUser(["EXPLORER"]), applications.list_all_applications_by_explorer_grouped_by_status);
  
  
  /**
	 * Set activated to FALSE to an actor
   *    RequiredRole: Administrator
	 *
	 * @section actors
	 * @type put
	 * @url /v1/actors/:actorId/ban
	 * @param {string} actorId
	*/
  app.route('/v1/actors/:actorId/ban')
      .put(actors.ban_an_actor);

  app.route('/v2/actors/:actorId/ban')
      .put(authController.verifyUser(["ADMINISTRATOR"]), actors.ban_an_actor);

      
  /**
	 * Set activated to TRUE to an actor
   *    RequiredRole: Administrator
	 *
	 * @section actors
	 * @type put
	 * @url /v1/actors/:actorId/unban
	 * @param {string} actorId
	*/
  app.route('/v1/actors/:actorId/unban')
      .put(actors.unban_an_actor);

  app.route('/v2/actors/:actorId/unban')
      .put(authController.verifyUser(["ADMINISTRATOR"]), actors.unban_an_actor);
  
  
  /**
	 * Modify search criteria of finder
   *    RequiredRole: to be the finder's explorer owner
	 *
	 * @section actors
	 * @type put
	 * @url /v1/actors/:actorId/myfinder
	 * @param {string} actorId
	*/
  app.route('/v1/actors/:actorId/myfinder')
      .put(actors.update_an_actor);
      //update_actor_finder ??

  app.route('/v2/actors/:actorId/myfinder')
      .put(authController.verifyUser(["EXPLORER"]), actors.update_a_verified_actor);
};
