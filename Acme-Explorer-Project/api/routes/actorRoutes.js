'use strict';
module.exports = function(app) {
  var actors = require('../controllers/actorController');

  /**
   * Get all actors
   *    RequiredRoles: None
   * Post an actor 
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

  /**
   * Put an actor
   *    RequiredRoles: to be the proper actor
   * Get an actor
   *    RequiredRoles: to be the proper actor or an Administrator
	 *
	 * @section actors
	 * @type get put
	 * @url /v1/actors/:actorId
   * @param {string} actorId
  */ 
  app.route('/v1/actors/:actorId')
    .get(actors.read_an_actor)
	  .put(actors.update_an_actor)
    //.delete(actors.delete_an_actor);
  
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
  .put(actors.ban_an_actor)

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
  .put(actors.unban_an_actor)
};