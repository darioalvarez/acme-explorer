'use strict';
module.exports = function(app) {
  var audits = require('../controllers/auditController');
  var authController = require('../controllers/authController');


  app.route('/v1/audits')
	  .get(audits.list_all_audits) //endpoint para facilitar desarrollo y pruebas
    .post(audits.create_an_audit);
   
  app.route('/v2/audits')
    .get(audits.list_all_audits) //endpoint para facilitar desarrollo y pruebas
    .post(authController.verifyUser(['AUDITOR']), audits.create_an_audit);


  app.route('/v1/audits/:auditId')
    .get(audits.read_an_audit)
    .put(audits.update_an_audit)
    .delete(audits.delete_an_audit);

  app.route('/v2/audits/:auditId')
    .get(authController.verifyUser(['AUDITOR']), audits.read_an_audit)
    .put(authController.verifyUser(['AUDITOR']), audits.update_an_audit)
    .delete(authController.verifyUser(['AUDITOR']), audits.delete_an_audit);

  app.route('/v2/actors/:auditorId/audits')
    .get(authController.verifyUser(['AUDITOR']), audits.audits_by_auditor);  

    app.route('/v2/trips/:tripId/audits')
    .get(audits.list_audits_by_trip);
  
};