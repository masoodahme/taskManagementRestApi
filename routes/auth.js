const express=require("express");
const router=express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
//import cors file
// const cors=require("./cors");
const cors=require("cors");
//controllers
const {signup,signin,signout,isSignedIn,checkBlackListTokens,isAuthorized,changePassword}=require("../controllers/auth");
const {getId}=require("../controllers/users");

router.post("/signup",cors(),[
    check("email","email is required").isEmail(),
    check("password","password should be at least 8 char").isLength({min:8})
],signup
);

//sign in router
router.post("/signin",cors(),[
    check("email","email is required").isEmail().isLength({min:1}),
    check("password","password is required").isLength({min:1})
],signin);

//change password router
router.post("/changePassword",cors(),getId,isSignedIn,checkBlackListTokens,isAuthorized,changePassword);
//signout
router.post("/signout",cors(),signout);

module.exports=router;