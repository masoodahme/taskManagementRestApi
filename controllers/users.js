const express=require("express");
const router=express.Router();
//models
const User=require("../models/users");
const jwt = require('jsonwebtoken');
const expressJwt=require("express-jwt");

exports.getId=(req,res,next)=>{
    //get user id from jwt token payload
    console.log("1");
    var Bearer=req.headers.authorization.split(" ")[0];
    if((req.headers.authorization)&&((Bearer=='Bearer')||(Bearer=='bearer')))
    {
        //var token=req.headers.authorization.split("")[1];
        var token=req.headers.authorization.split(" ")[1].split(".")[1];
        const buffer=new Buffer.from(token,"base64");
        const payloadString=buffer.toString();
        const payloadJson=JSON.parse(payloadString);
        var id=payloadJson._id;
    }
    else{
        console.log("NO Authorization");
    }
    //serach whether user id exists in db or not
    // User.findById(id).exec((err,id)=>{
    //     if(err || id)
    //     {
    //         console.log(err);
    //     }
    //     console.log("success");
    //     req.profile=id;
    //     console.log(req.profile);
       
    // })
    //store id in req.profile
    req.profile=id;
    next();
};

