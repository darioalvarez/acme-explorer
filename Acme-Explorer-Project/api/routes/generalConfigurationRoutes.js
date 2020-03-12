'use strict';
module.exports = function(app) {
  var generalConfig = require('../controllers/generalConfigurationController');
  var authController = require('../controllers/authController');


  /**
   * Get general configuration
   *    RequiredRoles: Administrator
   * Post general configuration: create general config
   *    RequiredRoles: Administrator
	 *
	 * @section generalConfiguration
	 * @type get post
	 * @url /v1/generalConfiguration
   * @param {string} role (administrator) 
  */
  app.route('/v1/generalConfiguration')
	  .get(generalConfig.get_general_configuration)
    .post(generalConfig.create_general_configuration);

  app.route('/v2/generalConfiguration')
	  .get(authController.verifyUser(['ADMINISTRATOR']), generalConfig.get_general_configuration)
    .post(authController.verifyUser(['ADMINISTRATOR']), generalConfig.create_general_configuration);

    
  app.route('/v1/generalConfiguration/:idGeneralConfiguration')
    .put(generalConfig.update_general_configuration);

  app.route('/v2/generalConfiguration/:idGeneralConfiguration')
    .put(authController.verifyUser(['ADMINISTRATOR']), generalConfig.update_general_configuration);

}