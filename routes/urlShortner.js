const express = require("express");
const router = express.Router();
const shortid = require("short-uuid");
const UrlModel = require("../models/shortUrl");

router.post("/shortUrl", async function (req, res) {
    try {
      const originalUrl = req.body.originalUrl;
      const baseUrl = process.env.BASE_URL;
  
      const urlCode = shortid.generate();
      if (req.body.originalUrl) {
          let url = await UrlModel.findOne({ url: originalUrl });
          if (url) {
            return res.json({
              url: url.url,
              urlHash: url.urlHash,
              shortUrl: url.shortUrl
            });
          } else {
            const shortUrl = baseUrl + "/" + urlCode;
            await UrlModel.create(
              {
                url: originalUrl,
                urlHash: urlCode,
                shortUrl: shortUrl
              },
              function(err, newUrlCreated) {
                if (err) {
                  console.log(err);
                } else {
                  return res.json({
                    url: newUrlCreated.url,
                    urlHash: newUrlCreated.urlHash,
                    shortUrl: newUrlCreated.shortUrl
                  });
                }
              }
            );
          }
        } else {
          return res.status(200).json({ errors :{ originalUrl:{ kind : "required"}}});
        }
    } catch (err) {
      console.log(err.message);
    }
  });

router.put("/shortUrl", async function (req, res) {
    try {
      const originalUrl = req.body.originalUrl;
      const baseUrl = process.env.BASE_URL;
  
      const urlCode = shortid.generate();
      if (req.body.originalUrl) {

          let url = await UrlModel.findOne({ url: originalUrl });
          if (url) {
            const shortUrl = baseUrl + "/" + urlCode;
            await UrlModel.findOneAndUpdate(
              { url: originalUrl },
              {
                urlHash: urlCode,
                shortUrl: shortUrl
              },
              { new: true },
              function(err, newUrlCreated) {
                if (err) {
                  console.log(err);
                } else {
                  return res.json({
                    message:"Short Url has been updated",
                    updatedUrl:{
                      url: newUrlCreated.url,
                      urlHash: newUrlCreated.urlHash,
                      shortUrl: newUrlCreated.shortUrl
                    }
                  });
                }
              }
            );
          } else {
            return res.status(200).json({errors :"URL Not Found"});
          }
        } else {
          return res.status(200).json({ errors :{ originalUrl:{ kind : "required"}}});
        }
    } catch (err) {
      console.log(err.message);
    }
  });

router.put("/originalUrl", async function (req, res) {
    try {
      const shortUrl = req.body.shortUrl;
      const newOriginalUrl = req.body.originalUrl;
  
          let url = await UrlModel.findOne({ shortUrl: shortUrl });
          if (url) {
            let newUrlCreated = await UrlModel.findOneAndUpdate(
              { shortUrl: shortUrl },
              {
                url:newOriginalUrl
              },
              { new: true });
              return res.json({
                message:"Original Url has been updated",
                updatedUrl:{
                  url: newUrlCreated.url,
                  urlHash: newUrlCreated.urlHash,
                  shortUrl: newUrlCreated.shortUrl
                }
              });
          } else {
            return res.status(200).json({errors :"URL Not Found"});
          }
    } catch (err) {
      console.log(err.message);
    }
  });

module.exports = router;
