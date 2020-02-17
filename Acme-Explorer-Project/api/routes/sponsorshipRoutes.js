'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');

  /**
   * Manage catalogue of sponsorships: 
   * Post sponsorships
   *    RequiredRoles: Administrator
   * Get sponsorships 
   *    RequiredRoles: Administrator
   *
   * @section sponsorships
   * @type put 
   * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
		.get(sponsorships.list_all_sponsorships)
    .post(sponsorships.create_an_sponsorship);


  /**
   * Put comments on an sponsorship or update it
   *    RequiredRoles: any (comment); administrator if any other update
   * Delete an sponsorship
   *    RequiredRoles: Administrator
   * Get an sponsorship
   *    RequiredRoles: any
   * 
   * @section sponsorships
   * @type get put delete 
   * @url /v1/sponsorships/:sponsorshipId
  */
  app.route('/v1/sponsorships/:sponsorshipId')
    .get(sponsorships.read_an_sponsorship)
	  .put(sponsorships.update_an_sponsorship)
    .delete(sponsorships.delete_an_sponsorship);

};
