const express = require("express");
const { authmiddleware } = require("../middleware/authmiddleware.js");
const { getusercontroler } = require("../controller/usercontroller.js");


const router = express.Router();

// routes
// get user 
router.get("/getuser",authmiddleware,getusercontroler);
module.exports = router;