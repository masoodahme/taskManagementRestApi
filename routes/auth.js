const express=require("express");
const router=express.Router();
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
//import cors file
const cors=require("./cors");
//controllers
const {signup,signin,signout,isSignedIn,checkToken,isAuthorized,generateToken}=require("../controllers/auth");
const {getId}=require("../controllers/users");

router.post("/signup",cors.corsWithOptions,[
    check("name","name should be atleast 3 charecters").isLength({min:3}),
    check("email","email is required").isEmail(),
    check("password","password should be at least 8 char").isLength({min:8})
],signup
);


router.post("/signin",cors.corsWithOptions,[
    check("email","email is required").isEmail().isLength({min:1}),
    check("password","password is required").isLength({min:1})
],signin);

//generate access token when it expires
router.post("/token",isSignedIn,generateToken);



router.post("/signout",cors.corsWithOptions,signout);

module.exports=router;