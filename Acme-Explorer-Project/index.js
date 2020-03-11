var express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    httpsPort = process.env.HTTPS_PORT || 8443,
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    massiveLoad = require('./massive-load'),
    Actor = require('./api/models/actorModel'),
    Application = require('./api/models/applicationModel'),
    Trip = require('./api/models/tripModel'),
    Sponsorship = require('./api/models/sponsorshipModel'),
    DataWareHouse = require('./api/models/dataWareHouseModel'),
    GeneralConfiguration = require('./api/models/generalConfigurationModel'),
    DataWareHouseTools = require('./api/controllers/dataWareHouseController'),
    bodyParser = require('body-parser'),
    admin = require('firebase-admin'),
    //serviceAccount = require('./acme-explorerjdc-firebase-adminsdk-5g4wl-daf3b8e615');
    serviceAccount = require('./acmeexplorer-c9013-firebase-adminsdk-i1xsf-9f0357a163.json');
var https = require('https');
var fs = require('fs');



// HTTPS SSL certificate
https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
    }, app)
    .listen(httpsPort, function () {
        console.log('Example app listening on port ' + httpsPort + '! Go to https://localhost:' + httpsPort + '/');
    })

// MongoDB URI building
var mongoDBHostname = process.env.mongoDBHostname || "localhost";
var mongoDBPort = process.env.mongoDBPort || "27017";
var mongoDBName = process.env.mongoDBName || "ACME-Explorer";
var mongoDBURI = "mongodb://" + mongoDBHostname + ":" + mongoDBPort + "/" + mongoDBName;

mongoose.connect(mongoDBURI, {
    poolSize: 10, // Up to 10 sockets
    connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // skip trying IPv6
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
mongoose.set('useCreateIndex', true);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, idToken" //ojo, que si metemos un parametro propio por la cabecera hay que declararlo aquí para que no de el error CORS
    );
    //res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    next();
});

admin.initializeApp({
    credential : admin.credential.cert(serviceAccount),
    databaseURL: 'https://acme-explorerjdc.firebaseio.com'
});

var routesActors = require('./api/routes/actorRoutes');
var routesApplications = require('./api/routes/applicationRoutes');
var routesTrips = require('./api/routes/tripRoutes');
var routesSponsorship = require('./api/routes/sponsorshipRoutes');
var routesDataWareHouse = require('./api/routes/dataWareHouseRoutes');
var routesGeneralConfiguration = require('./api/routes/generalConfigurationRoutes');
var routesLogin = require('./api/routes/loginRoutes');

routesActors(app);
routesApplications(app);
routesTrips(app);
routesSponsorship(app);
routesDataWareHouse(app);
routesGeneralConfiguration(app);
routesLogin(app);

console.log("Connecting DB to: " + mongoDBURI);
mongoose.connection.on("open", function (err, conn) {
    app.listen(port, function () {
        console.log('ACME-Explorer RESTful API server started on: ' + port);
    });
});

// Massive load section
console.log("== Starting massive loading ==");
massiveLoad.loadActorsFromApi(mongoose, mongoDBURI, true, 'https://my.api.mockaroo.com/actors.json?key=c4e6e8c0', function () {
    massiveLoad.loadTripsFromApi(mongoose, mongoDBURI, true, 'https://my.api.mockaroo.com/trips.json?key=c4e6e8c0', function () {
        massiveLoad.loadApplicationsFromApi(mongoose, mongoDBURI, true, 'https://my.api.mockaroo.com/applications.json?key=c4e6e8c0', function () {
            console.log("== Finished massive loading ==");
        });
    });
});

mongoose.connection.on("error", function (err, conn) {
    console.error("DB init error " + err);
});

DataWareHouseTools.createDataWareHouseJob();
module.exports = app;
