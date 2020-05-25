const express=require("express");
const router=express.Router();
//models
const User=require("../models/users");
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.signup=(req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){
      return res.status(422).json({
          errors:errors.array()[0].msg
      })
}
const user=new User(req.body);
 user.save((err,users)=>{
     if(err)
     {
        console.log(err);
        return res.status(400).json({
            err:"Not able to save user in DB"
        });
     }
     res.json({
         name:users.name,
         email:users.email,
         id:users._id,
         password:users.encrypt_password
     });
 })

};

exports.signin=(req,res)=>{
    const {email,password}=req.body;
 const errors=validationResult(req);
 if(!errors.isEmpty())
 {
     return res.status(422).json({
         errors:errors.array()[0].msg
     })
 }
 User.findOne({email:email},(err,user)=>{
     if(err)
     {
        console.log(err);
        return res.status(400).json({
            err:"error in connection"
        });
     }
     if(!user)
     {
        console.log(err);
        return res.status(400).json({
            err:"Not able to find user in DB"
        });
     }

    if(!user.authenticate(password))
    {
        console.log(err);
        return res.status(401).json({
            err:"Email and password does not exists"
        });
    }
     //token created
    const token=jwt.sign({_id:user.id},process.env.SECRET);
    //put token in cookie
    res.cookie("token",token,{expire:new Date()+9999});
     //destructuring
    const {_id,email,name}=user;
    res.json({token,user:{
        name:name,
        email:email,
        id:_id
    } 
    });
    
 })
};

exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"user has signed out"
    })
}