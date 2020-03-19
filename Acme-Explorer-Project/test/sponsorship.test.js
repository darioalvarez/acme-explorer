const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose'),
  Actor = mongoose.model('Actors'),
  Trip = mongoose.model('Trips');

const { expect } = chai;
chai.use(chaiHttp);

describe("Sponsorship Tests", () => {
  let test_sponsor_id = null;
  let test_trip_id = null;
  let manager_id = null;
  let test_sponsorship_id = null;

  before((done) => {

    // Creación de un SPONSOR para crear sponsorships
    chai
      .request(app)
      .post('/v1/actors')
      .send({
        "name": "TestUserName",
        "surname": "TestUserSurname",
        "email": "testuser@test.com",
        "phone": "123456789",
        "password": "password",
        "role": "SPONSOR"
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          test_sponsor_id = res.body._id;
        }

        // Creación de un MANAGER para crear trips
        chai
          .request(app)
          .post('/v1/actors')
          .send({
            "name": "TestUserName",
            "surname": "TestUserSurname",
            "email": "testmanager@test.com",
            "phone": "123456789",
            "password": "password",
            "role": "MANAGER"
          })
          .end((err, res) => {
            if (err) {
              done(err);
            } else {
              manager_id = res.body._id;

              // Creación de un TRIP para asociarle sponsorship
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
                    test_trip_id = res.body._id;
                    done();
                  }
                });
            }
          })
      })
  });



  after((done) => {
    Actor.deleteMany({ _id: { $in: [test_sponsor_id, manager_id] } }, function (err) { });
    Trip.deleteOne({ _id: test_trip_id }, function (err) { });

    done();
  });


  describe("Sponsorship Tests", () => {
    it("GET Sponsorship Test", done => {
      chai
        .request(app)
        .get("/v1/sponsorships/")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res).not.to.be.empty;
          if (err) done(err);
          else done();
        });
    });

    it("POST Sponsorship Test", done => {
      chai
        .request(app)
        .post("/v1/sponsorships")
        .send({
          "banner": "",
          "url": "http://www.sponsorshiptest.es",
          "paid": false,
          "trip": test_trip_id,
          "sponsor": test_sponsor_id
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          test_sponsorship_id = res.body._id;
          if (err) done(err);
          else done();
        });
    });


    it("PUT Sponsorship recently created", done => {
      chai
        .request(app)
        .put("/v1/sponsorships/" + test_sponsorship_id)
        .send({
          "url": "http://www.urlupdated.com",
          "paid": true

        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('url').to.be.equal('http://www.urlupdated.com');
          expect(res.body).to.have.property('paid').to.be.equal(true);
          if (err) done(err);
          else done();
        });
    });


    it("PAY Sponsorship recently created", done => {
      chai
        .request(app)
        .put("/v1/sponsorships/" + test_sponsorship_id + "/45")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('cost').to.be.equal(45);

          if (err) done(err);
          else done();
        });
    });


    it("GET Sponsorship recently created", done => {
      chai
        .request(app)
        .get("/v1/sponsorships/" + test_sponsorship_id)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('paid').to.be.equal(true);
          expect(res.body).to.have.property('url').to.be.equal('http://www.urlupdated.com');
          expect(res.body).to.have.property('cost').to.be.equal(45);

          if (err) done(err);
          else done();
        });
    });


    it("DELETE Sponsorship Test", done => {
      chai
        .request(app)
        .delete("/v1/sponsorships/" + test_sponsorship_id)
        .end((err, res) => {
          expect(res).to.have.status(200);
          if (err) done(err);
          else done();
        });
    });

    it("GET Sponsorship recently deleted", done => {
      chai
        .request(app)
        .get("/v1/sponsorships/" + test_sponsorship_id)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.lengthOf(0);

          if (err) done(err);
          else done();
        });
    });

  });

});