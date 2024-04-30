const catchAsyncErrors = require("../middleware/catchAsyncErrors")
const Policy = require("../models/policy.model")
const Aggrement = require("../models/Aggrement.model")



exports.addpolicy = catchAsyncErrors(async(req,res)=>{
    try {
        const {policy}=req.body;
        const createdpolicy=await  Policy.create({policy})
        return res.status(200).send({policycreated:true,createdpolicy})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:error.message})
    }
})
exports.adduseragrrement = catchAsyncErrors(async(req,res)=>{
    try {
        const {Aggremen}=req.body;
        const createdagrrement=await Aggrement.create({Aggrement:Aggremen})
        return res.status(200).send({createdagrrement:true,createdagrrement})
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:error.message})
    }
})

exports.getpolicy=catchAsyncErrors(async(req,res)=>{
    try {
        const data = await Policy.find({})
        console.log(data)
        return res.status(200).send(data[0])
    } catch (error) {
        console.log(error)
        return res.status(500).send({message:error.message})   
    }
})
exports.getuserAgreement=catchAsyncErrors(async(req,res)=>{
    try {
        const data = await Aggrement.find()
        return res.status(200).send(data[0])
    } catch (error) {
        return res.status(500).send({message:error.message})   
    }
})



exports.updatepolicy=catchAsyncErrors(async(req,res)=>{
    try {
    const {id,policy}=req.body;
    const data = await Policy.findByIdAndUpdate({_id:id},{policy:policy},{new:true})
    return res.status(200).send({updatepolicy:true,data})
} catch (error) {
        console.log(error)
        return res.status(500).send(error)
}
})
exports.updateuseragreeement=catchAsyncErrors(async(req,res)=>{
    try {
    const {id,Aggremen}=req.body;
    const data = await Aggrement.findByIdAndUpdate({_id:id},{Aggrement:Aggremen},{new:true})
    return res.status(200).send({updateagreement:true,data})
} catch (error) {
        console.log(error)
        return res.status(500).send(error)
}
})