const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose');
var test_sponsorship_id = "5e4aa74e49222e8a3b6e772c";//new mongoose.Types.ObjectId(); //5e4aa74e49222e8a3b6ee01c
var test_sponsor_id = "5e57990f858954a9ea70a7cc";
var test_trip_id = "5e5d5881423c5b85061fb26b";

const { expect } = chai;
chai.use(chaiHttp);
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
        "_id": test_sponsorship_id,
        "banner": "",
        "url": "http://www.sponsorshiptest.es",
        "paid": false,
        "trip": test_trip_id,
        "sponsor": test_sponsor_id
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
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