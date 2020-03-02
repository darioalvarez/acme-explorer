'use strict';
module.exports = function(app) {
  var dataWareHouse = require('../controllers/dataWareHouseController');


  	/**
	 * Get a list of all indicators or post a new computation period for rebuilding
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get post
	 * @url /dataWareHouse
	 * @param [string] rebuildPeriod
	 * 
	*/
	app.route('/v1/dataWareHouse')
	.get(dataWareHouse.list_all_indicators)
	.post(dataWareHouse.rebuildPeriod);

	/**
	 * Get a list of last computed indicator
	 * RequiredRole: Administrator
	 * @section dataWareHouse
	 * @type get
	 * @url /dataWareHouse/latest
	 * 
	*/
	app.route('/v1/dataWareHouse/latest')
	.get(dataWareHouse.last_indicator);


	// Returns he amount of money that explorer has spent on trips during period p, so it needs query params.
    app.route('/v1/cube/:explorer/:period')
        .get(dataWareHouse.cube)

    // Returns the explorers that spent the money returned by the cube, so it needs query params. 
    app.route('/v1/cube/explorers')
        .get(dataWareHouse.cube_explorers)
};
