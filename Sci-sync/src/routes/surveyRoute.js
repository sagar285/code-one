const express = require("express");
const multer = require('multer');
const { isAuthenticated, isadminAuthenticated, issuperadminAuthenticated } = require("../middleware/auth");
const { addSurvey, getAllSurveys, getSingleSurvey, updateSingleSurvey, deleteSingleSurvey } = require("../controllers/survey.controller");
const router = express.Router();
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// Survey Routes
router.post("/survey/addSurvey",upload.fields([{ name: 'image', maxCount: 1 },]),issuperadminAuthenticated,addSurvey)

router.get("/survey/allSurveys",getAllSurveys)

router.post("/survey/singleSurvey",getSingleSurvey)


router.put("/survey/updateSurvey",isadminAuthenticated,updateSingleSurvey)

router.post("/survey/deleteSurvey",isadminAuthenticated,deleteSingleSurvey)


module.exports =router; 