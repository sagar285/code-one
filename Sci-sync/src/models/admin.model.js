
const mongoose =require("mongoose")
const jwt = require("jsonwebtoken");


const adminSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        trim: true,
        lowercase: true,
    },
    password:{
        type:String,
    },
    Approve:{
        type:Boolean,
        default:true,
    },
    issuperadmin:{
        type:Boolean,
        default:true,   
    }
    // Type:{
    //     type: String,
    //     enum: ['Admin', 'SuperAdmin','All Admin'],
    // }
})



adminSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, "hjfenjnefnjnefnjnefvkjnfevnknefvnkjevfk", {
    });
  };

module.exports = mongoose.model("Admin",adminSchema);