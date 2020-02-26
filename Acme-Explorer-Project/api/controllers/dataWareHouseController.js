var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Trips = mongoose.model('Trips');

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
var rebuildPeriod = '0 0 * * * *';  //El que se usará por defecto
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
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function minTripsByManager (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function maxTripsByManager (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function standarDeviationTripsByManager (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function avgApplicationsPerTrip (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function minApplicationsPerTrip (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function maxApplicationsPerTrip (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function standarDeviationApplicationsPerTrip (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function avgPriceTrips (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function minPriceTrips (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function maxPriceTrips (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function standarDeviationPriceTrips (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};


function ratioApplicationsByStatus (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function avgPriceFinders (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};

function topKeywordsFinder (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, res)
   }); 
};