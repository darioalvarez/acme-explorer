var async = require("async");
var mongoose = require('mongoose'),
  DataWareHouse = mongoose.model('DataWareHouse'),
  Cubes = mongoose.model('Cube'),
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
var rebuildPeriod = '*/10 * * * * *';
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

        infoTripsByManager, //Dario
        infoApplicationsPerTrip, //Jorge
        infoPriceTrips, //Dario
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
          new_dataWareHouse.avgTripsByManager = results[0].avg[0];
          new_dataWareHouse.minTripsByManager = results[0].min[0];
          new_dataWareHouse.maxTripsByManager = results[0].max[0];
          new_dataWareHouse.standarDeviationTripsByManager = results[0].stdev[0];

          new_dataWareHouse.avgApplicationsPerTrip = results[1].avg[0];
          new_dataWareHouse.minApplicationsPerTrip = results[1].min[0];
          new_dataWareHouse.maxApplicationsPerTrip = results[1].max[0];
          new_dataWareHouse.standarDeviationApplicationsPerTrip = results[1].stdev[0];

          new_dataWareHouse.avgPriceTrips = results[2].avg[0];
          new_dataWareHouse.minPriceTrips = results[2].min[0];
          new_dataWareHouse.maxPriceTrips = results[2].max[0];
          new_dataWareHouse.standarDeviationPriceTrips = results[2].stdev[0];

          new_dataWareHouse.ratioApplicationsByStatus = results[3];
          new_dataWareHouse.avgPriceFinders = results[4];
          new_dataWareHouse.topKeywordsFinder = results[5];
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

function infoTripsByManager (callback) {
  Trips.aggregate([
    {$group: {_id:"$manager", num_trips:{$sum:1}}},
    {$facet: {
        "avg": [{$group: {_id:0, avg_trips_per_manager:{$avg:"$num_trips"}}}],
        "min": [{$group: {_id:0, min_trips_per_manager:{$min:"$num_trips"}}}],
        "max": [{$group: {_id:0, max_trips_per_manager:{$max:"$num_trips"}}}],
        "stdev": [{$group: {_id:0, stdev_trips_per_manager:{$stdDevSamp:"$num_trips"}}}]
    }},
    {$project: {_id:0, avg:"$avg.avg_trips_per_manager", min:"$min.min_trips_per_manager",
    max:"$max.max_trips_per_manager", stdev:"$stdev.stdev_trips_per_manager"}}
    
  ], function(err, res){
       callback(err, res[0])
   }); 
};



function infoApplicationsPerTrip (callback) {
  Applications.aggregate([
    {$group: {_id:"$trip", num_applications:{$sum:1}}},
    {$facet: {
        "avg": [{$group: {_id:0, avg_applications_per_trip:{$avg:"$num_applications"}}}],
        "min": [{$group: {_id:0, min_applications_per_trip:{$min:"$num_applications"}}}],
        "max": [{$group: {_id:0, max_applications_per_trip:{$max:"$num_applications"}}}],
        "stdev": [{$group: {_id:0, stdev_applications_per_trip:{$stdDevSamp:"$num_applications"}}}]
    }},
    {$project: {_id:0, avg:"$avg.avg_applications_per_trip", min:"$min.min_applications_per_trip",
    max:"$max.max_applications_per_trip", stdev:"$stdev.stdev_applications_per_trip"}}
    
  ], function(err, res){
       callback(err, res[0])
   }); 
};




function infoPriceTrips (callback) {
  Trips.aggregate([
    {$facet: {
        "avg": [{$group: {_id:0, avg_price_per_trip:{$avg:"$price"}}}],
        "min": [{$group: {_id:0, min_price_per_trip:{$min:"$price"}}}],
        "max": [{$group: {_id:0, max_price_per_trip:{$max:"$price"}}}],
        "stdev": [{$group: {_id:0, std_dev_price_per_trip:{$stdDevSamp:"$price"}}}]
    }},
    {$project: {_id:0, avg:"$avg.avg_price_per_trip", min:"$min.min_price_per_trip",
    max:"$max.max_price_per_trip", stdev:"$stdev.std_dev_price_per_trip"}}
    
  ], function(err, res){
       callback(err, res[0])
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
