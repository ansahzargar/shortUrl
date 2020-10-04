const express = require("express");
const router = express.Router();
const {createUrl,updateUrl} = require("../controllers/url")
const UrlModel = require("../models/shortUrl");

router.post("/shortUrl",createUrl);

router.put("/shortUrl",updateUrl);

module.exports = router;
