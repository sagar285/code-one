const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Walletmodal = require("../models/wallet.model")


exports.addwallet = catchAsyncErrors(async(req,res)=>{
    try{
       const { userid,surveyid,amount,date  } = req.body;
       const newdate = new Date(date);
       
       const data = await Walletmodal.create({userid,surveyid,date:newdate})
       data.todayamount 
    

    }catch(error){

    }
})
