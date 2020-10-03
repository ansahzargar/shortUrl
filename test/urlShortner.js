let mongoose = require("mongoose");
let UrlModel = require("../models/shortUrl");

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();
const shortid = require("short-uuid");

chai.use(chaiHttp);
//Our parent block
describe("shortUrl", () => {
  beforeEach(done => {
    //empty the database
    UrlModel.deleteMany({}, err => {
      done();
    });
  });

  /*
   * Test the /GET route
   */
  describe("/GET shortUrl", () => {
    it("it should GET all the urls", done => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST shortUrl", () => {
    it("it should not POST a shortUrl without original url field", done => {
      let url = {};
      chai
        .request(server)
        .post("/api/url/shortUrl")
        .send(url)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("originalUrl");
          res.body.errors.originalUrl.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
    it("it should POST a shortUrl with original url field", done => {
      let url = {
        originalUrl:
          "https://www.google.com/search?q=testing+of+hypothesis&oq=testing&aqs=chrome.2.69i57j0l4j69i60.7365j0j7&sourceid=chrome&ie=UTF-8"
      };
      chai
        .request(server)
        .post("/api/url/shortUrl")
        .send(url)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("url");
          res.body.should.have.property("urlHash");
          res.body.should.have.property("shortUrl");
          done();
        });
    });
  });

  /*
   * Test the /PUT route
   */
  describe("/PUT shortUrl", () => {
    it("it should UPDATE a shortUrl given the url", done => {
      const urlCode = shortid.generate();
      const shortUrl = process.env.BASE_URL + "/" + urlCode;
      let urlSave = new UrlModel({
        url:"https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai",
        urlHash: urlCode,
        shortUrl: shortUrl
      });
      urlSave.save((err, url) => {
        chai
          .request(server)
          .put("/api/url/shortUrl")
          .send({
            originalUrl: url.url
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message").eql("Short Url has been updated");
            res.body.updatedUrl.should.have.property("url");
            res.body.updatedUrl.should.have.property("urlHash");
            res.body.updatedUrl.should.have.property("shortUrl");
            done();
          });
      });
    });
    it("it should not PUT a shortUrl without original url field", done => {
      let url = {};
      chai
        .request(server)
        .put("/api/url/shortUrl")
        .send(url)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("errors");
          res.body.errors.should.have.property("originalUrl");
          res.body.errors.originalUrl.should.have
            .property("kind")
            .eql("required");
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe("/GET/:code shortUrl", () => {
    it("it should GET a HTML response by the given hash code", done => {
      const urlCode = shortid.generate();
      const shortUrl = process.env.BASE_URL + "/" + urlCode;
      let urlSave = new UrlModel({
        url:
          "https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai",
        urlHash: urlCode,
        shortUrl: shortUrl
      });
      urlSave.save((err, url) => {
        chai
          .request(server)
          .get("/" + url.urlHash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
  });

  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:code shortUrl", () => {
    it("it should DELETE a shortUrl record from database by the given hash code", done => {
      const urlCode = shortid.generate();
      const shortUrl = process.env.BASE_URL + "/" + urlCode;
      let urlSave = new UrlModel({
        url:
          "https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai",
        urlHash: urlCode,
        shortUrl: shortUrl
      });
      urlSave.save((err, url) => {
        chai
          .request(server)
          .delete("/" + url.urlHash)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("DELETED SUCCESSFULLY");
            done();
          });
      });
    });
  });
});
