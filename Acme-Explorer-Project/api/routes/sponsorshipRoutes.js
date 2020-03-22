'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');
  var auth = require('../controllers/authController');

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
   * Manage flat rate cost 
   * Post number
   *    RequiredRoles: Administrator
   *
   * @section sponsorships
   * @type put 
   * @url /v1/sponsorships/:sponsorshipId/flatRate
  */
  app.route('/v1/sponsorships/:sponsorshipId/:flatRate')
  .put(sponsorships.change_flat_rate)

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
  
  /**
   * Manage the pay status
   * Post number
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type put 
   * @url /v1/sponsorships/:sponsorshipId/pay
  */
  app.route('/v1/sponsorships/:sponsorshipId/pay')
  .put(sponsorships.pay_a_sponsorship);

  /**
   * Manage flat rate cost 
   * Post number
   *    RequiredRoles: Administrator
   *
   * @section sponsorships
   * @type put 
   * @url /v2/sponsorships/:sponsorshipId/flatRate
  */
  app.route('/v2/sponsorships/:sponsorshipId/flatRate')
      .put(auth.verifyUser(['Administrator']), sponsorships.change_flat_rate)

 /**
   * Manage catalogue of sponsorships: 
   * Post sponsorships
   *    RequiredRoles: Sponsor
   * Get sponsorships 
   *    RequiredRoles: any
   *
   * @section sponsorships
   * @type put 
   * @url /v2/sponsorships
  */
  app.route('/v2/sponsorships')
  .get(sponsorships.list_all_sponsorships)
  .post(auth.verifyUser(['Sponsor']), sponsorships.create_an_sponsorship);

  /**
   * Put comments on an sponsorship or update it
   *    RequiredRoles: Sponsor
   * Delete an sponsorship
   *    RequiredRoles: Sponsor
   * Get an sponsorship
   *    RequiredRoles: any
   * 
   * @section sponsorships
   * @type get put delete 
   * @url /v2/sponsorships/:sponsorshipId
  */
  app.route('/v2/sponsorships/:sponsorshipId')
  .get(sponsorships.read_an_sponsorship)
  .put(auth.verifyUser(['Sponsor']),sponsorships.update_an_sponsorship_v2)
  .delete(auth.verifyUser(['Sponsor']),sponsorships.delete_an_sponsorship);

   /**
   * Manage the pay status
   * Post number
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type put 
   * @url /v2/sponsorships/:sponsorshipId/pay
  */
  app.route('/v2/sponsorships/:sponsorshipId/pay')
    .put(auth.verifyUser(['Sponsor']), sponsorships.pay_a_sponsorship);      
};


