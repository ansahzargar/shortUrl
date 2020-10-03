const express = require("express");
const router = express.Router();
const UrlModel = require("../models/shortUrl");
 
router.get("/:code",async function (req, res, next) {
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
  });

router.get("/",async function (req, res, next) {
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
  });

router.delete("/:code",async function (req, res, next) {
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
  });

module.exports = router;
