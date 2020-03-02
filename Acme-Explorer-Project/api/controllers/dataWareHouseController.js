var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trips = mongoose.model('Trips');
  Applications = mongoose.model('Applications');
  Actors = mongoose.model('Actors');

exports.list_all_indicators = function(req, res) {
  console.log('Requesting indicators');
  
  DataWareHouse.find().sort("-computationMoment").exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

exports.last_indicator = function(req, res) {
  
  DataWareHouse.find().sort("-computationMoment").limit(1).exec(function(err, indicators) {
    if (err){
      res.send(err);
    }
    else{
      res.json(indicators);
    }
  });
};

var CronJob = require('cron').CronJob;
var CronTime = require('cron').CronTime;

//'0 0 * * * *' una hora
//'*/30 * * * * *' cada 30 segundos
//'*/10 * * * * *' cada 10 segundos
//'* * * * * *' cada segundo
//var rebuildPeriod = '*/10 * * * * *';  //El que se usará por defecto
var rebuildPeriod = '*/90 * * * * *';
var computeDataWareHouseJob;

exports.rebuildPeriod = function(req, res) {
  console.log('Updating rebuild period. Request: period:'+req.query.rebuildPeriod);
  rebuildPeriod = req.query.rebuildPeriod;
  computeDataWareHouseJob.setTime(new CronTime(rebuildPeriod));
  computeDataWareHouseJob.start();

  res.json(req.query.rebuildPeriod);
};

function createDataWareHouseJob(){
      computeDataWareHouseJob = new CronJob(rebuildPeriod,  function() {
      
      var new_dataWareHouse = new DataWareHouse();
      console.log('Cron job submitted. Rebuild period: '+rebuildPeriod);
      async.parallel([
        avgTripsByManager, //Darío
        minTripsByManager, //Darío
        maxTripsByManager, //Darío
        standarDeviationTripsByManager, //Darío
        avgApplicationsPerTrip, //Jorge
        minApplicationsPerTrip, //Jorge
        maxApplicationsPerTrip, //Jorge
        standarDeviationApplicationsPerTrip, //Jorge
        avgPriceTrips, //Darío
        minPriceTrips, //Darío
        maxPriceTrips, //Darío
        standarDeviationPriceTrips, //Darío
        ratioApplicationsByStatus, //Jorge
        avgPriceFinders, //Jorge
        topKeywordsFinder //Jorge
      ], function (err, results) {
        if (err){
          console.log("Error computing datawarehouse: "+err);
        }
        else{
          //console.log("Resultados obtenidos por las agregaciones: "+JSON.stringify(results));
          new_dataWareHouse.avgTripsByManager = results[0];
          new_dataWareHouse.minTripsByManager = results[1];
          new_dataWareHouse.maxTripsByManager = results[2];
          new_dataWareHouse.standarDeviationTripsByManager = results[3];
          new_dataWareHouse.avgApplicationsPerTrip = results[4];
          new_dataWareHouse.minApplicationsPerTrip = results[5];
          new_dataWareHouse.maxApplicationsPerTrip = results[6];
          new_dataWareHouse.standarDeviationApplicationsPerTrip = results[7];
          new_dataWareHouse.avgPriceTrips = results[8];
          new_dataWareHouse.minPriceTrips = results[9];
          new_dataWareHouse.maxPriceTrips = results[10];
          new_dataWareHouse.standarDeviationPriceTrips = results[11];
          new_dataWareHouse.ratioApplicationsByStatus = results[12];
          new_dataWareHouse.avgPriceFinders = results[13];
          new_dataWareHouse.topKeywordsFinder = results[14];
          new_dataWareHouse.rebuildPeriod = rebuildPeriod;
    
          new_dataWareHouse.save(function(err, datawarehouse) {
            if (err){
              console.log("Error saving datawarehouse: "+err);
            }
            else{
              console.log("new DataWareHouse succesfully saved. Date: "+new Date());
            }
          });
        }
      });
    }, null, true, 'Europe/Madrid');
}


module.exports.createDataWareHouseJob = createDataWareHouseJob;


//COMPLETAR FUNCIONES A PARTIR DE AQUÍ

function avgTripsByManager (callback) {
  Trips.aggregate([
   {$group: {_id:"$manager", num_trips: {$sum:1}}},
   {$group: {_id:0, avg_trips_per_manager:{$avg:"$num_trips"}}}
  ], function(err, res){
       callback(err, res[0].avg_trips_per_manager)
   });
};

function minTripsByManager (callback) {
   Trips.aggregate([
    {$group: {_id:"$manager", num_trips:{$sum:1}}},
    {$group: {_id:0, min_trips_per_manager:{$min:"$num_trips"}}}
  ], function(err, res){
       callback(err, res[0].min_trips_per_manager)
   });
};

function maxTripsByManager (callback) {
  Trips.aggregate([
    {$group: {_id:"$manager", num_trips:{$sum:1}}},
    {$group: {_id:0, max_trips_per_manager:{$max:"$num_trips"}}}
  ], function(err, res){
       callback(err, res[0].max_trips_per_manager)
   });
};

function standarDeviationTripsByManager (callback) {
   Trips.aggregate([
    {$group: {_id:"$manager", num_trips:{$sum:1}}},
    {$group: {_id:0, std_dev_trips_per_manager:{$stdDevSamp:"$num_trips"}}}
  ], function(err, res){
       callback(err, res[0].std_dev_trips_per_manager)
   });
};

function avgApplicationsPerTrip (callback) {
  Applications.aggregate([
    {$group: {_id:"$trip", num_applications:{$sum:1}}},
    {$group: {_id:0, avg_applications_per_trip:{$avg:"$num_applications"}}}
  ], function(err, res){
       callback(err, res[0].avg_applications_per_trip)
   }); 
};

function minApplicationsPerTrip (callback) {
  Applications.aggregate([
    {$group: {_id:"$trip", num_applications:{$sum:1}}},
    {$group: {_id:0, min_applications_per_trip:{$min:"$num_applications"}}}
  ], function(err, res){
       callback(err, res[0].min_applications_per_trip)
   }); 
};

function maxApplicationsPerTrip (callback) {
  Applications.aggregate([
    {$group: {_id:"$trip", num_applications:{$sum:1}}},
    {$group: {_id:0, max_applications_per_trip:{$max:"$num_applications"}}}
  ], function(err, res){
       callback(err, res[0].max_applications_per_trip)
   }); 
};

function standarDeviationApplicationsPerTrip (callback) {
  Applications.aggregate([
    {$group: {_id:"$trip", num_applications:{$sum:1}}},
    {$group: {_id:0, stdev_applications_per_trip:{$stdDevSamp:"$num_applications"}}}
  ], function(err, res){
       callback(err, res[0].stdev_applications_per_trip)
   }); 
};

function avgPriceTrips (callback) {
  Trips.aggregate([
    {$group: {_id:0, avg_price_per_trip:{$avg:"$price"}}}
   ], function(err, res){
        callback(err, res[0].avg_price_per_trip)
    });
};

function minPriceTrips (callback) {
  Trips.aggregate([
    {$group: {_id:0, min_price_per_trip:{$min:"$price"}}}
   ], function(err, res){
        callback(err, res[0].min_price_per_trip)
    });
};

function maxPriceTrips (callback) {
  Trips.aggregate([
    {$group: {_id:0, max_price_per_trip:{$max:"$price"}}}
   ], function(err, res){
        callback(err, res[0].max_price_per_trip)
    });
};

function standarDeviationPriceTrips (callback) {
  Trips.aggregate([
    {$group: {_id:0, std_dev_price_per_trip:{$stdDevSamp:"$price"}}}
   ], function(err, res){
        callback(err, res[0].std_dev_price_per_trip)
    }); 
};


function ratioApplicationsByStatus (callback) {
  Applications.aggregate([
    {$facet: {
        "numTotalApplications": [{ $group: {_id:null, numTotal:{$sum:1}} }],
        "groupedByStatus": [{ $group: {_id:"$status", num_applications: {$sum:1}} }]
    }},
    {$project:{_id:0,grouped:"$groupedByStatus", totalApplications:"$numTotalApplications.numTotal"}},
    {$unwind:"$totalApplications"},
    {$unwind:"$grouped"},
    {$project: {_id:0, status:"$grouped._id", ratio:{$divide:["$grouped.num_applications","$totalApplications"]}} }
], function(err, res){
       callback(err, res)
   }); 
};

function avgPriceFinders (callback) {
  Actors.aggregate([
    {$match:{role:"EXPLORER", "finder.minPrice":{$exists:true,$ne:null}}},
    {$project: {sumaprecios:{$add:["$finder.minPrice","$finder.maxPrice"]}}},
    {$group: {_id:0,totalPrecios:{$sum:"$sumaprecios"}, numeroFinders:{$sum:1}}},
    {$project: {_id:null,avgPrecios:{$divide:["$totalPrecios","$numeroFinders"]}}}
], function(err, res){
       callback(err, res[0].avgPrecios)
   }); 
};

function topKeywordsFinder (callback) {
  Actors.aggregate([
    {$match:{role:"EXPLORER", "finder.keyword":{$exists:true,$ne:null}}},
    {$project: {_id:0, keywords:{$toLower:"$finder.keyword"}}},
    {$group: {_id:"$keywords", cont:{$sum:1}}},
    {$sort: {cont:-1}},
    {$limit: 10}
], function(err, res){
       callback(err, res)
   }); 
};
