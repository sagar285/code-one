const express = require("express");
const { clientRegistration, clientLogin, allsurveysofclients, clientsdataonsurvey, clientChangedPassword } = require("../controllers/client.controller");
const { isadminAuthenticated } = require("../middleware/auth");
const router = express.Router();


router.post("/client/registration",clientRegistration)

router.post("/client/login",clientLogin)

router.post("/client/passwordupdated",clientChangedPassword)

router.post("/client/getallsurveys",isadminAuthenticated,allsurveysofclients)


router.post("/client/clientsdataonsurvey",isadminAuthenticated,clientsdataonsurvey)


module.exports = router;