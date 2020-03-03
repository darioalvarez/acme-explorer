const app = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");

const { expect } = chai;
chai.use(chaiHttp);
describe("Basic Tests", () => {
  it("GET Actors Test", done => {
    chai
      .request(app)
      .get("/v1/actors/")
      .end((err, res) => {
        expect(res).to.have.status(200);
        //expect(res.body.status).to.equals("success");
        //expect(res.body.message).to.equals("Welcome To Testing API");
        done();
      });
  });

});