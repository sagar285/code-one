const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const adminModel = require("../models/admin.model");
const sendToken = require("../utils/sendToken");
const bcrypt =require("bcrypt")
const clientModal =require("../models/client.model")
const IOModal = require("../models/io.model")
const admin = require('firebase-admin');
const WalletModal =require("../models/wallet.model");
const crypto = require("crypto");
const { handleEmailNotificationProcess } = require("../utils/generateRoute");







exports.adminLogin =catchAsyncErrors(async(req,res)=>{
    const {email,password} =req.body;
    try {
    if(email == "prannay@xeonic.ai" || email == "atharva@xeonic.ai" || email == "yug@xeonic.ai")
    {
        const admin = await adminModel.findOne({email})
        console.log(admin)
        if(admin){
            const passwordVerify = admin.password == password;
            if(passwordVerify){
                sendToken(admin,200,res)
            }
            else{
                return res.status(200).send({message:"Enter email or password wrong"})
            }

        }
        else{
            if(password =="xeonicyc"){
const admin = await adminModel.create({email,password})
         sendToken(admin,200,res)  
            }
            else{
                return res.status(200).send({message:"This password is not admin password"})
            }
        }
    }
    else{
        return res.status(200).send({message:"This resource only accessd by super admin"});
    }
   
    } catch (error) {
        console.log("Login Admin Error",error)
        res.status(500).json({message:"Error in login"})
    }
})

exports.adminStatusUpdate =catchAsyncErrors(async(req,res)=>{

    const {status,id} = req.body;
    if(req.user.issuperadmin){
        try {
            const  adminstatusupdate = await adminModel.findByIdAndUpdate({_id:id},{Approve:status},{new:true})
            res.status(200).send({message:"Status Updated Successfully",data:adminstatusupdate})
        } catch (error) {
            console.log("Error in status update",error)
            res.status(500).json({message:"Error in updating admin status"})
        }
    }
    else{
        res.status(401).json({message:"This resource not accessed publicly"})
    }
  
})

// superadmin get all admin signup request who has not admin 
exports.getalladminrequest =catchAsyncErrors(async(req,res)=>{
        try {
        const adminrequest = await adminModel.find({Approve:false});
        console.log("request yhan tk aayi h")
        res.status(200).json({request:adminrequest})
    } catch (error) {
        console.log("error in getting all request",error)
        res.status(500).json({message:error.message})
    }
})

exports.clientStatusUpdate =catchAsyncErrors(async(req,res)=>{
    const {status,clientid}=req.body;
    try {
    const statusUpdate = await clientModal.findByIdAndUpdate({_id:clientid},{isapproved:status});
    res.status(200).json({statusUpdate:statusUpdate})
} catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
}
})


// super admin gets all clients who has approved

exports.getallapprovedclients =catchAsyncErrors(async(req,res)=>{
    try {
        const allapprovedclients = await clientModal.find({isapproved:true})
    res.status(200).json({allapprovedclients:allapprovedclients})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
})


exports.getadmininputoutputrequest =catchAsyncErrors(async(req,res)=>{
    try {
        const {surveyid}=req.body
        const data = await IOModal.find({$and:[{ispayment:"Pending"},{surveyid:surveyid}]})
        return res.status(200).send({data:data});
    } catch (error) {
        return res.status(500).send({message:error.message});
    }
})



const genraterandomid = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

exports.updateadmininputoutputrequest =catchAsyncErrors(async(req,res)=>{
    const {status,id}=req.body;
    try {
        const updateStatus = await IOModal.findByIdAndUpdate({_id:id},{ispayment:status},{new:true}).populate(["userid","surveyid"])
        if(updateStatus.ispayment == "Rejected"){
            const walletdata = await WalletModal.create({amount:0,status:"Rejected",txnid:0,userid:updateStatus.userid})
        } 
        if(updateStatus.ispayment == "Approved"){
            const surveyamount = updateStatus?.surveyid?.pay
            const walletdata = await WalletModal.create({amount:surveyamount,status:"Approved",txnid:genraterandomid(),userid:updateStatus.userid})
        } 
        const message = {
            notification: {
                title:"Data App",
                body:` Your survey requst hs been ${status}`,
            },   
              data:{
                navigationId:'Home'
            }, 
            token: "fBaJ55i-S6yXFVh3QaIJKj:APA91bGwBVLMMJuSMKXMiBzJw7_Fd-PF3Iwvkbv2XoLXvUl-ogczISSNelqsqW84zM9oSl3VGUoVsAmPnQaBm-upORs-GcXr1pDSa25Yhm_NmAlM7gFii0V9jTnHCS0-XQAhNJk8TiwU"
        };
        const response = await admin.messaging().send(message);
        res.status(200).json({updatedata:updateStatus});
    } catch (error) {
        console.log("error in update survey request")
        res.status(500).json({message:error.message})
    }
})




// add client by admin side 

exports.addClient =catchAsyncErrors(async(req,res)=>{
    const {name,email,password}=req.body;
    try {
       const isclientexist = await clientModal.findOne({email});
       if(isclientexist){
        return res.status(200).send({clientexist:true,message:"This email id already attached with other client"});
       }
       else{
        const newclient = await clientModal.create({name,email,adminpassword:password});
        return res.status(200).send({clientexist:false,clientdata:newclient});
       }   
    } catch (error) {
        console.log(error)
    }
})



exports.sendEmailNotification = catchAsyncErrors(async (req, res) => {
    const { email } = req.body;
    const client = await clientModal.findOne({ email });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }  
    try {
      await handleEmailNotificationProcess(email,res);
      res.status(200).json({ message: "Email Notification send succesfully" });
    } catch (error) {
      console.error("Email Notification Error: ", error);
      res.status(500).json({ message: "Error Email Notification" });
    }
  });





