const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
Trip = mongoose.model('Trips');
Actor = mongoose.model('Actors');

const { expect } = chai;
chai.use(chaiHttp);
describe("Trip Tests", () => {
  let manager_id = null;
  //let explorer_id = null;
  //let trip_id_ready_to_apply = null;
  //let trip_id_not_ready_to_apply = null;
  //let application_id = null;

  before((done) => {

    // Creación de un MANAGER para crear trips
    chai
    .request(app)
    .post('/v1/actors')
    .send({
    "name": "TestUserName",
    "surname": "TestUserSurname",
    "email": "testuser@test.com",
    "phone": "123456789",
    "password": "password",
    "role": "MANAGER"
    })
    .end((err, res) => {
    if(err) {
        done(err);
    } else {
        manager_id = res.body._id;
        done();
    }
    })

  });

  after((done) => {
    Actor.deleteOne({_id: manager_id}, function (err) {});
    //Trip.deleteMany({_id: {$in:[trip_id_ready_to_apply, trip_id_not_ready_to_apply]}}, function (err) {});

    done();
  });


  //COMIENZO DE LOS TEST DE TRIP
  describe('GET trips', () => {
    it("GET all trips", done => {
      chai
        .request(app)
        .get("/v1/trips/")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).not.to.be.empty;
          if (err) done(err);
          else done();
        });
    });
  })
  
  
  describe('POST trips', () => {
    it("should POST a trip with code 201", done => {
      chai
        .request(app)
        .post("/v1/trips/")
        .send({
            "title": "TestTripTitle",
            "description": "TestTripDescription",
            "requirements": ["req1", "req2"],
            "startDate": "2020-11-11",
            "endDate": "2021-12-12",
            "manager": manager_id,
            "stages": [
              {
                  "title": "Stage1",
                  "description": "description1",
                  "price": 100
              },
              {
                  "title": "Stage2",
                  "description": "description2",
                  "price": 250
              }
          ]
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('ticker');
          expect(res.body).to.have.property('published').to.equal(false);
          expect(res.body).to.have.property('cancelled').to.equal(false);
          expect(res.body).to.have.property('price').to.equal(350);
          trip_id = res.body._id;
          if (err) done(err);
          else done();
        });
    });


    /*it("should return code 422", done => {
      chai
        .request(app)
        .post("/v1/applications/")
        .send({
          "explorer": explorer_id,
          "trip": trip_id_not_ready_to_apply
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          //expect(res.body).to.have.property('status').contains('PENDING');
          //expect(res.body).to.have.property('paid').to.equal(false);
  
          if (err) done(err);
          else done();
        });
    });*/

  })

  
  /*describe('PUT applications', () => {
    it("should insert a comment with code 200", done => {
      chai
        .request(app)
        .put("/v1/applications/" + application_id)
        .send({
          "comments": ['Este es un comentario de prueba']
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('comments').not.to.be.null;
          expect(res.body).to.have.property('comments').to.be.lengthOf(1);
  
          if (err) done(err);
          else done();
        });
    });


    it("shouldn't reject the application without reason (code 400)", done => {
      chai
        .request(app)
        .put("/v1/applications/" + application_id + "/reject")
        .end((err, res) => {
          expect(res).to.have.status(400);
  
          if (err) done(err);
          else done();
        });
    });

    it("should process the application with code 200", done => {
      chai
        .request(app)
        .put("/v1/applications/" + application_id + "/process")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status').contains('DUE');
  
          if (err) done(err);
          else done();
        });
    });


    it("should pay the application with code 200", done => {
      chai
        .request(app)
        .put("/v1/applications/" + application_id + "/pay")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status').contains('ACCEPTED');
          //expect(res.body).to.have.property('paid').to.equal(false);
  
          if (err) done(err);
          else done();
        });
    });

  })


  describe('DELETE applications', () => {
    it("should delete an application", done => {
      chai
        .request(app)
        .delete("/v1/applications/" + application_id)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
  
          if (err) done(err);
          else done();
        });
    });
  })*/

});