const mongoose = require('mongoose');


const WalletSchema = new mongoose.Schema({
    userid: {
        type: mongoose.ObjectId,
        ref: "user",
      },
      amount:{
        type:Number,
        default:0,
      },
      txnid:{
        type:Number,
        default:0,
      },
      status:{
        type:String,
        default:"Pending",
      }


})

module.exports = mongoose.model("userwallets",WalletSchema);






