let mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    url:String,
    urlHash:String, //PK
    shortUrl:String,
},{timestamps : true})


let ShortUrl = mongoose.model('ShortUrl',urlSchema)

module.exports = ShortUrl