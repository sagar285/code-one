const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const clientModal =require("../models/client.model");
const Survey = require("../models/survey.model");
const IO = require("../models/io.model");
const sendToken = require("../utils/sendToken");
const bcrypt =require("bcrypt")




exports.clientRegistration = catchAsyncErrors(async(req,res)=>{
    const {name,email,password}=req.body;
    const client = await clientModal.findOne({email});
    if(client){
        try {
            res.status(200).json({clientexist:true,client});
        } catch (error) {
           console.log("Error in client registration",error)
           res.status(500).json({message:"Error processing request"}) 
        }
    }
    else{
        try {
            const hashedpassword = await bcrypt.hash(password,10)
        const newclient = await clientModal.create({email,password:hashedpassword,name})
        res.status(200).json({clientexist:false,client:newclient})
        } catch (error) {
            console.error("Admin Registration Error",error)
            res.status(500).json({message:"Admin registration failed"})
        } 
    }
})

exports.clientLogin =catchAsyncErrors(async(req,res)=>{
    const {email,password} =req.body;
    console.log("request coming");
    const client = await clientModal.findOne({email})
    try {
        if(client){
            const passwordVerify = password === client.adminpassword;
            const passwordverification = password == client.password;
            if(passwordVerify){
                sendToken(client,201,res)
            }
            else if(passwordverification){
                sendToken(client,200,res)
            }
            else{
                res.status(401).json({message: "Invalid email or password"})
            }
        }
    } catch (error) {
        console.log("Login Admin Error",error)
        res.status(500).json({message:"Error in login"})
    }
})

exports.clientChangedPassword =catchAsyncErrors(async(req,res)=>{

    const {email,newpassword} =req.body;
    try {
     const isemailexist= await clientModal.findOne({email});
     if(isemailexist){
        if(newpassword == isemailexist.adminpassword){
            return res.status(200).send({message:"You can not use this password"});
        }
        else{
      const  updatepasword = await clientModal.findOneAndUpdate({email},{password:newpassword},{new:true})
         return res.status(200).send({passwordupdated:true,updatepasword});
        }
     }
     else{
        return res.status(401).send({message:"This email does not exist"});
     }
   
} catch (error) {
     console.log(error)
     return res.status(200).send({message:error.message});   
}

})


// only admin access this 
exports.allClientsAdminSide =catchAsyncErrors(async(req,res)=>{
    console.log("requestaayi ")
    try {
        const allclients = await clientModal.find()
        console.log(allclients)
        res.status(200).json({clients:allclients})
    } catch (error) {
        console.log("error in get clients information")
        res.status(500).json({message:error.message})
    }
})


// all surveys related to this clients

exports.allsurveysofclients =catchAsyncErrors(async(req,res)=>{
    try {
        console.log("req.user._id",req?.user?._id)
        const allsurveys = await Survey.find({clientid:req?.user?._id})
        res.status(200).json({allsurveys:allsurveys})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message}) 
    }
})





// single survey how many users upload their data

exports.clientsdataonsurvey = catchAsyncErrors(async(req,res)=>{
    try {
        const {surveyid}=req.body;
        
        const data = await IO.find({surveyid:surveyid}).populate("userid")
        return res.status(200).send(data)
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:error.message})
    }
})

