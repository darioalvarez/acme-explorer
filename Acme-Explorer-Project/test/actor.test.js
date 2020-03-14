const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
describe("Actor Tests", () => {
  it("GET Actors Test", done => {
    chai
      .request(app)
      .get("/v1/actors/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.body.status).to.equals("success");
        //expect(res.body.message).to.equals("Welcome To Testing API");
        if (err) done(err);
        else done();
      });
  });

  it("POST Actors Test", done => {
    chai
      .request(app)
      .post("/v1/actors/")
      .send({
        "name": "ExplorerTESTName",
        "surname": "ExplorerTESTSurname",
        "email": "explorer@testmail.com",
        "password": "password",
        "phone": "+34612345678",
        "role": "EXPLORER"
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.body.status).to.equals("OK");
        //expect(res.body.message).to.equals("Welcome To Testing API");
        if (err) done(err);
        else done();
      });
  });

});