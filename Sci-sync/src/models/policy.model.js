const mongoose = require('mongoose');


const Policy = new mongoose.Schema({
   policy:{
    type:String,
   }
})

module.exports = mongoose.model("policy",Policy);