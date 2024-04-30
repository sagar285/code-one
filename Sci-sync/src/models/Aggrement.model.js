const mongoose = require('mongoose');


const Aggrement = new mongoose.Schema({
    Aggrement:{
    type:String,
   }
})

module.exports = mongoose.model("Aggrement",Aggrement);