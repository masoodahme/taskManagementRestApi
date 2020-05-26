const express=require("express");
const router=express.Router();
//models
const User=require("../models/users");
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt=require("express-jwt");

exports.getId=(req,res,next,id)=>{
    User.findById(id).exec((err,id)=>{
        if(err || id)
        {
            console.log(err);
        }
        req.profile=id;
        next();
    })
};

