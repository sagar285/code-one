const express = require("express");
const router = express.Router();
const { isAuthenticated,issuperadminAuthenticated } = require("../middleware/auth");
const { addpolicy, adduseragrrement, getpolicy, getuserAgreement, updatepolicy, updateuseragreeement } = require("../controllers/policyagreement.controller");

router.post("/addpolicy",issuperadminAuthenticated,addpolicy)
router.post("/adduseragreement",issuperadminAuthenticated,adduseragrrement)
router.put("/updatepolicy",issuperadminAuthenticated,updatepolicy)
router.put("/updateuseragreement",issuperadminAuthenticated,updateuseragreeement)
router.get("/getpolicy",getpolicy)
router.get("/getuseragreement",getuserAgreement)




       
module.exports = router;