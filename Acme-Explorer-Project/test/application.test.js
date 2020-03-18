const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
Trip = mongoose.model('Trips');
Actor = mongoose.model('Actors');
//var test_actor_id = mongoose.Types.ObjectId();
//var trip_id = mongoose.Types.ObjectId();

const { expect } = chai;
chai.use(chaiHttp);
describe("Application Tests", () => {
  let manager_id = null;
  let explorer_id = null;
  let trip_id_ready_to_apply = null;
  let trip_id_not_ready_to_apply = null;
  let application_id = null;

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

        // Creación de un trip apto para recibir applications
        chai
          .request(app)
          .post('/v1/trips')
          .send({
              "title": "TestTripTitle",
              "description": "TestTripDescription",
              "requirements": ["req1", "req2"],
              "startDate": "2020-11-11",
              "endDate": "2021-12-12",
              "published": true,
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
              if (err) {
                  done(err);
              } 
              else {
                trip_id_ready_to_apply = res.body._id;
                //done();
              }
          });

          // Creación de un trip NO apto para recibir applications (cancelado)
          chai
          .request(app)
          .post('/v1/trips')
          .send({
              "title": "TestTripTitle2",
              "description": "TestTripDescription2",
              "requirements": ["req1", "req2"],
              "startDate": "2020-11-11",
              "endDate": "2021-12-12",
              "published": true,
              "cancelled": true,
              "cancellation_reason": "test test test",
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
              if (err) {
                  done(err);
              } 
              else {
                trip_id_not_ready_to_apply = res.body._id;
                //done();
              }
          });
      }
    })

    // Creación de un EXPLORER para crear applications
    chai
      .request(app)
      .post('/v1/actors')
      .send({
          "name": "ExplorerTestName",
          "surname": "ExplorerTestSurame",
          "email": "explorertest@test.com",
          "phone": "123456789",
          "password": "password",
          "role": "EXPLORER"
      })
      .end((err, res) => {
          if (err) {
              done(err);
          } 
          else {
            explorer_id = res.body._id;
            done();
          }
      });

  });

  after((done) => {
    Actor.deleteOne({_id: explorer_id}, function (err) {
      if (err) return handleError(err);
    });
    Actor.deleteOne({_id: manager_id}, function (err) {
      if (err) return handleError(err);
    });
    //Trip.collection.deleteMany({});

    done();
  });


  //COMIENZO DE LOS TEST DE APPLICATIONS
  describe('GET applications', () => {
    it("GET all applications", done => {
      chai
        .request(app)
        .get("/v1/applications/")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).not.to.be.empty;
          if (err) done(err);
          else done();
        });
    });
  })
  
  
  describe('POST applications', () => {
    it("should POST an application with code 200", done => {
      chai
        .request(app)
        .post("/v1/applications/")
        .send({
          "explorer": explorer_id,
          "trip": trip_id_ready_to_apply
        })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status').contains('PENDING');
          expect(res.body).to.have.property('paid').to.equal(false);
  
          if (err) done(err);
          else done();
        });
    });


    it("should return code 422", done => {
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
    });

  })

  

/*
  it("UPDATE Actor recently created", done => {
    chai
      .request(app)
      .put("/v1/actors/" + test_actor_id)
      .send({
        "name": "ExplorerTESTNameUPDATED",
        "surname": "ExplorerTESTSurnameUPDATED"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('name').to.be.equal('ExplorerTESTNameUPDATED');
        expect(res.body).to.have.property('surname').to.be.equal('ExplorerTESTSurnameUPDATED');

        if (err) done(err);
        else done();
      });
  });


  it("BAN Actor recently created", done => {
    chai
      .request(app)
      .put("/v1/actors/" + test_actor_id + "/ban")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('activated').to.be.equal(false);

        if (err) done(err);
        else done();
      });
  });


  it("GET Actor recently created", done => {
    chai
      .request(app)
      .get("/v1/actors/" + test_actor_id)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('activated').to.be.equal(false);
        expect(res.body).to.have.property('name').to.be.equal('ExplorerTESTNameUPDATED');
        expect(res.body).to.have.property('email').to.be.equal("explorer@testmail.com");

        if (err) done(err);
        else done();
      });
  });


  it("POST Actors Duplicate email", done => {
    chai
      .request(app)
      .post("/v1/actors/")
      .send({
        "name": "Explorer2TESTName",
        "surname": "Explorer2TESTSurname",
        "email": "explorer@testmail.com",
        "password": "password2",
        "phone": "+34612345679",
        "role": "EXPLORER"
      })
      .end((err, res) => {
        expect(res).to.have.status(409);
        if (err) done(err);
        else done();
      });
  });



  it("DELETE Actor Test", done => {
    chai
      .request(app)
      .delete("/v1/actors/" + test_actor_id)
      .end((err, res) => {
        expect(res).to.have.status(200);
        if (err) done(err);
        else done();
      });
  });

  it("GET Actor recently deleted", done => {
    chai
      .request(app)
      .get("/v1/actors/" + test_actor_id)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.lengthOf(0);

        if (err) done(err);
        else done();
      });
  });*/

});