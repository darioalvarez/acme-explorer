var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Cubes = mongoose.model('Cube'),
  Trips = mongoose.model('Trips');
  Applications = mongoose.model('Applications');

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
        topKeywordsFinder, //Jorge
        computeCube //Carlos
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
       callback(err, 34532)
   }); 
};

function minTripsByManager (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
   }); 
};

function maxTripsByManager (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
   }); 
};

function standarDeviationTripsByManager (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
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
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
   }); 
};

function minPriceTrips (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
   }); 
};

function maxPriceTrips (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
   }); 
};

function standarDeviationPriceTrips (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
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
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, 34532)
   }); 
};

function topKeywordsFinder (callback) {
  Trips.aggregate([
   {$match: {} }
  ], function(err, res){
       callback(err, ['keyword1', 'keyword2'])
   }); 
};


function computeCube(callback) {
  for (var i = 1; i < 37; i++) {
      var period = "M";
      if (i < 10) {
          period = period + "0" + i;
      } else {
          period = period + i;
      }
      var minDateRange = new Date();
      minDateRange.setMonth(minDateRange.getMonth() - i);
      Applications.aggregate([
          {
              $match: {
                  status: "ACCEPTED",
                  updateMoment: {
                      $gte: minDateRange,
                  }
              }
          },
          {
              $group: {
                  _id: "$explorer",
                  trips: { $push: "$trip" },
              }
          },
          {
              $project: {
                  _id: "$_id",
                  trips: "$trips",
                  period: period
              }
          }
      ], function (err, explorer_trips) {
          for (var j = 0; j < explorer_trips.length; j++) {
              var tripsIdArray = explorer_trips[j].trips;
              var explorerId = explorer_trips[j]._id;
              var periodCube = explorer_trips[j].period;
              Trips.aggregate([
                  {
                      $match: {
                          _id: { $in: tripsIdArray }
                      }
                  }, {
                      $group: {
                          _id: null,
                          money: { $sum: "$price" }
                      }
                  }, {
                      $project: {
                          money: "$money",
                          explorer: explorerId,
                          periodCube: periodCube
                      }
                  }
              ], function (err2, docs) {
                  var new_cube = new Cubes();
                  new_cube.explorer = docs[0].explorer;
                  new_cube.money = docs[0].money;
                  new_cube.period = docs[0].periodCube;

                  new_cube.save(function (err, cubeSaved) {
                      if (err) {
                          console.log("Error saving cube:  " + err);
                      } else {
                          console.log("New Cube succesfully saved. Date: " + new Date());
                      }
                  });
              });
          }
      });
  }
  callback(null, 1);
}

// Returns the amount of money that explorer e has spent on trips during period p, which can be M01-M36 to 
// denote any of the last 1-36 months or Y01-Y03 to denote any of the last three years
exports.cube = function (req, res) {
  var explorerId = req.params.explorer;
  var periodRange = req.params.period;
  var period = periodRange;
  explorerId = mongoose.Types.ObjectId(explorerId);
  if (periodRange.startsWith("Y")) {
      switch (periodRange) {
          case "Y01":
              period = "M12";
              break;
          case "Y02":
              period = "M24";
              break;
          case "Y03":
              period = "M36";
              break;
          default:
              period = "Y01";
      }
  }
  Cubes.aggregate([
      {
          $match: {
              explorer: explorerId,
              period: period
          }
      }, {
          $project: {
              explorer: "$explorer",
              money: "$money",
              period: period
          }
      }
  ], function (err, cubeReturned) {
      if (err) {
          res.status(404);
      } else {
          res.send(cubeReturned);
      }
  });
};

function getMongoOperator(coString) {
  var co;
  switch (coString) {
      case "==":
          co = "$eq";
          break;
      case '!=':
          co = "$ne";
          break;
      case '>':
          co = "$gt";
          break;
      case '>=':
          co = "$gte";
          break;
      case '<':
          co = "$lt";
          break;
      case '<=':
          co = "$lte";
          break;
      default:
          co = null
          break;
  }
  return co;
}

// Given the period 'p', an amount of money 'm and a comparison operator 'co', 
// returns the explorers that have spent 'co' than 'm' during 'p'.
exports.cube_explorers = function (req, res) {
  var supportedCO = ['==', '!=', '>', '>=', '<', '<='];
  var queryCO = req.query.co;
  var period = req.query.period;
  var money = req.query.money;
  if (co.in(supportedCO)) {
      var jsonCO = {};
      var co = getMongoOperator(queryCO);
      jsonCO[co] = money; // if 'co' is >=, and money = 20, this will give {$gte: 20}
      Cubes.aggregate([
          {
              $match: {
                  period: period,
                  money: jsonCO
              }
          }, { $group: { _id: "$explorer", explorers: { $push: "$explorer" } } },
          {
              $project: {
                  _id: 0,
                  explorers: "$explorers"
              }
          }
      ], function(err, explorersReturned){
          if (err) {
              res.status(404);
          } else {
              res.send(explorersReturned);
          }
      });
  } else {
      res.status(400).send("Comparison operator not supported");
  }
};