'use strict';
module.exports = function(app) {
  var sponsorships = require('../controllers/sponsorshipController');
  var auth = require('../controllers/authController');

  /**
   * Manage catalogue of sponsorships: 
   * Post sponsorships
   *    RequiredRoles: Sponsor
   * Get sponsorships 
   *    RequiredRoles: any
   *
   * @section sponsorships
   * @type get post 
   * @url /v1/sponsorships
  */
  app.route('/v1/sponsorships')
		.get(sponsorships.list_all_sponsorships)
    .post(sponsorships.create_an_sponsorship);

  app.route('/v2/sponsorships')
    .get(sponsorships.list_all_sponsorships)
    .post(auth.verifyUser(['SPONSOR']), sponsorships.create_an_sponsorship);



  /**
   * Put a sponsorship
   *    RequiredRoles: Sponsor
   * Delete an sponsorship
   *    RequiredRoles: Sponsor
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
  
  app.route('/v2/sponsorships/:sponsorshipId')
    .get(sponsorships.read_an_sponsorship)
    .put(auth.verifyUser(['SPONSOR']),sponsorships.update_an_sponsorship_v2)
    .delete(auth.verifyUser(['SPONSOR']),sponsorships.delete_an_sponsorship);



  /**
   * Manage the pay status
   * Put
   *    RequiredRoles: Sponsor
   *
   * @section sponsorships
   * @type put 
   * @url /v1/sponsorships/:sponsorshipId/pay
  */
  app.route('/v1/sponsorships/:sponsorshipId/pay')
    .put(sponsorships.pay_a_sponsorship);


  app.route('/v2/sponsorships/:sponsorshipId/pay')
    .put(auth.verifyUser(['SPONSOR']), sponsorships.pay_a_sponsorship);      
};


