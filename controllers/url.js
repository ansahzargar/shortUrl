const UrlModel = require("../models/shortUrl");
const shortid = require("short-uuid");

let createUrl = async function (req, res) {
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
             UrlModel.create(
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
  }

let updateUrl = async function (req, res) {
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
  }

let getOne = async function (req, res, next) {
    try {
      const url = await UrlModel.findOne({ urlHash: req.params.code });
  
      if (url) {
        return res.status(302).redirect(url.url);
      } else {
        return res.status(404).json({errors :"URL Not Found"});
      }
    } catch (err) {
      return res.status(500).json({errors:"Server error"});
    }
  }

let getAll = async function (req, res, next) {
    try {
      const url = await UrlModel.find();
      // console.log(url);
      if (url) {
        return res.status(200).json(url);
      } else {
        return res.status(404).json({errors :"URL Not Found"});
      }
    } catch (err) {
      return res.status(500).json({errors:"Server error"});
    }
  }

let deleteUrl = async function (req, res, next) {
    try {
      const url = await UrlModel.findOne({ urlHash: req.params.code });
  
      if (url) {
        await UrlModel.deleteOne({ urlHash: req.params.code }, function(
          err,
          deletedData
        ) {
          if (err) {
            console.log(err.message);
          } else {
            return res.status(200).json({ message :"DELETED SUCCESSFULLY"});
          }
        });
      } else {
        return res.status(404).json({errors :"URL Not Found"});
      }
    } catch (err) {
      return res.status(500).json({errors:"Server error"});
    }
  }

  module.exports={createUrl,updateUrl,getAll,getOne,deleteUrl}