const express = require("express");
const router = express.Router();
const UrlModel = require("../models/shortUrl");
const {getAll,getOne,deleteUrl} = require("../controllers/url")
 
router.get("/:code",getOne);

router.get("/",getAll);

router.delete("/:code",deleteUrl);

module.exports = router;
