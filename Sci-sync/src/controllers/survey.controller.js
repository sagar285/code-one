const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Survey = require("../models/survey.model");
const surveyrequestModel = require("../models/surveyrequest.model");
const crypto =require("crypto");
const { uploadFile } = require("./io.controller");

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");
// add survey 
exports.addSurvey =  async(req,res)=>{
    const {title,description,instructions,pay,qualification,input,Output,clientid} =req.body;


    const imageFile = req.files['image']?.[0];
    const imgname = imageFile && generateFileName()  
    await uploadFile(imageFile?.buffer, imgname, imageFile.mimetype);
    const file =req.file;
    // const  imgurl =`https://d2xw2of6hxx7fn.cloudfront.net/${imgname}`
    console.log(req.body);
    try {
        const newsurvey = await Survey.create({ 
            title,description,instructions,pay:parseInt(pay), 
            input,Output,qualification,clientid,image:imgname
        })
      res.status(200).json({ newsurvey: true, survey: newsurvey });
    } catch (error) {
        console.log("New Survey Error",error)
      res.status(500).json({ message: "New Survey Addition Failed" });
    }  
};



// get all surveys which present in db

exports.getAllSurveys =catchAsyncErrors(async(req,res)=>{
    try {
        const allSurveys = await Survey.find({});
        return res.status(200).json({allSurveys:true,allSurveys}) 
    } catch (error) {
        console.log("Error in getting All Sureveys",error)
        return res.status(500).json({message:"Error in getting all surveys"})
    }
})


exports.getAllSurveysforuser=catchAsyncErrors(async(req,res)=>{
    try {
        const {userid} = req.body
        const surveyRequests = await surveyrequestModel.find({ userid: userid });
        const requestedSurveyIds = surveyRequests.map(request => request.surveyid);
    
        // Find the surveys that the user has not requested

        const allSurveys = await Survey.find({ _id: { $nin: requestedSurveyIds } });

        return res.status(200).json({allSurveys:true,allSurveys}) 
        
    } catch (error) { 
        console.log(error)
        return res.status(500).json({message:"Error in getting all surveys"})
    }
})


// get single surveys by their Id

exports.getSingleSurvey = catchAsyncErrors(async(req,res)=>{
    const {id}=req.body;
    try {
        const singleSurvey = await Survey.findById(id)
        return res.status(200).json({singleSurvey:singleSurvey});
    } catch (error) {
        console.log("Error in Getting Single Survey  BY ID",error)
        return res.status(500).json({message:'Error in Getting Survey By Id'})
    }
})



exports.updateSingleSurvey=catchAsyncErrors(async(req,res)=>{
    const {title,description,instructions,pay,imgurl,id,qualification,input,Output} =req.body;
    const file = req.file ;
    try {
        const updatedSurvey = await Survey.findByIdAndUpdate({_id:id},{
            title,description,instructions,pay,imgurl,qualification,input,Output
        },{new:true})

        return res.status(200).json({updatedSurvey:true,updatedSurvey})

    } catch (error) {
        console.log("Error in update Survey",error)
        return res.status(500).json({msg:"Error in Update Survey Data"})
    }



})

exports.deleteSingleSurvey =catchAsyncErrors(async(req,res)=>{
    const {id} =req.body;
    try {
        const deletedSurvey = await Survey.findByIdAndDelete(id)
        return res.status(200).json({deleteSurvey:true,message:"Suvey has been deleted successfully"})
        
    } catch (error) {
        console.log("Error in Deleting Survey",error)
        return res.status(500).json({message:"Error in Deleting Survey"})
    }
   


})






