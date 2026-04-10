const express = require("express");
const { loginController, registerController } = require("../controller/authcontroller.js");

const router = express.Router();

// routes
// register | post
router.post("/register",registerController);

// login | post
router.post("/login",loginController);
module.exports = router;