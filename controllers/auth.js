const express=require("express");
const router=express.Router();
//models
const User=require("../models/users");
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt=require("express-jwt");
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
exports.isSignedIn=expressJwt({
    secret:process.env.SECRET,
    requestProperty:"auth" //it holds the user _id which is generated when the user is signed in
});
// exports.checkToken=(req,res,next)=>{
//     const header = req.headers['authorization'];

//     if(header!=='undefined'){
//             const bearer=header.split(" ");
//             const token=bearer[1];
//             req.token=token;
//             next();
//     }
//     else{
//         return res.json({
//             "error":"No Token found Access Denied"
//         })
//     }
// }
exports.isAuthorized=(req,res,next)=>{
    //req.user is set when user is singed in and req.auth is present in isSignedIn
    console.log(req.profile);
    let checker=req.profile && req.auth && req.profile._id==req.auth._id;
    if(!checker)
    {   
        return res.status(403).json({
            "message":"Access Denied"
        })

    }
    next();
};
exports.signout=(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"user has signed out"
    })
}