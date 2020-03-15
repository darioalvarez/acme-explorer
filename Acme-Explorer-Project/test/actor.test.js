const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
var mongoose = require('mongoose');
var test_actor_id = mongoose.Types.ObjectId();

const { expect } = chai;
chai.use(chaiHttp);
describe("Actor Tests", () => {
  it("GET Actors Test", done => {
    chai
      .request(app)
      .get("/v1/actors/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res).not.to.be.empty;
        if (err) done(err);
        else done();
      });
  });

  it("POST Actors Test", done => {
    chai
      .request(app)
      .post("/v1/actors/")
      .send({
        "_id": test_actor_id,
        "name": "ExplorerTESTName",
        "surname": "ExplorerTESTSurname",
        "email": "explorer@testmail.com",
        "password": "password",
        "phone": "+34612345678",
        "role": "EXPLORER"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('finder');
        expect(res.body.activated).to.equal(true);

        if (err) done(err);
        else done();
      });
  });


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
  });

});