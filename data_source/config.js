let mongoose = require('mongoose')
const dbUrl = process.env.MONGO_URI;
// console.log("here",typeof(process.env.MONGO_URI))
const connectToDb = async () =>{
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser : true,
            useUnifiedTopology: true
          })
           console.log("mongoDb connected")
    } catch (err) {
        console.log(err.message)
    }
}

module.exports = connectToDb;