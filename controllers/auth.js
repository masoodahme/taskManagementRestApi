const express=require("express");
const router=express.Router();
//User model
const User=require("../models/users");
//BlackList model
const BlackList=require("../models/blacklists");

const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const expressJwt=require("express-jwt");
//signup controller
exports.signup=(req,res)=>{
    //check for validation errors
  const errors=validationResult(req);
  if(!errors.isEmpty()){
      return res.status(422).json({
          errors:errors.array()[0].msg
      })
}
//save the details of user in database
const user=new User(req.body);
 user.save((err,users)=>{
     if(err)
     {
        return res.status(400).json({
            err:"Not able to save user in DB"
        });
     }
     res.json({
         
         email:users.email,
         id:users._id
     });
 })
};
//to check black listed token is present in database or not
 exports.checkBlackListTokens=(req,res,next)=>{
      //get the bearer token from request header 
    const token=req.headers.authorization.split(" ")[1];
    BlackList.find({"tokens.token":token})
    .exec((err,docs)=>{
        if(err||!docs)
        {
            return res.status(403).json({
                            message:"invalid token",
                            error:err
                        });
        }
        if(docs.length==0)
        {
          //if there is no such token present then send to next middeleware
            next();
           
        }
        else{
            //send response as invalid token if token is present in database
            return res.status(403).json({
                message:"invalid token",
                error:err
            });
        }
    
    })
 };
 //signing controller
exports.signin=(req,res)=>{
    const {email,password}=req.body;
      //check for validation errors
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
        return res.status(400).json({
            err:"error in connection"
        });
     }
     if(!user)
     {
        return res.status(400).json({
            err:"Not able to find user in DB"
        });
     }
     //invoke the authenticate method to compare user password
    if(!user.authenticate(password))
    {
        return res.status(401).json({
            err:"Email and password does not exists"
        });
    }
     //Access token created
    const accesstoken=jwt.sign({_id:user.id},process.env.SECRET,{expiresIn:"7d"});
     //destructuring
    const {_id,email}=user;
    res.json({user:{
        email:email,
        id:_id,
        token:accesstoken
    } 
    }); 
 })
};

//isSignedIn contoller to validate jwt token
exports.isSignedIn=expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth" //it holds the user _id which is generated when the user is signed in
});
//check for authorization
exports.isAuthorized=(req,res,next)=>{
    //req.user is set when user is singed in and req.auth is present in isSignedIn
    let checker=req.profile && req.auth && req.profile==req.auth._id;
    if(!checker)
    {   
        return res.status(403).json({
            "message":"Access Denied"
        })

    }
    next();
};
//controller to change the user password
exports.changePassword=(req,res)=>{
    var encrypt;
    const {password,changepassword,confirmpassword}=req.body;
    User.findById({_id:req.profile})
    .then((docs)=>{
        if(docs.length==0)
        {
            return res.status(403).json({
                message:"User is not found in database"
            })
        }
        //invoke the authenticate method to compare user password
        if(!docs.authenticate(password))
        {
            return res.status(401).json({
                err:"Email and password does not exists"
            });
        }
        //if no such errors then convert the plain password into encrypted
        encrypt=docs.securePassword(changepassword);
    })
    .then(()=> User.updateOne({_id:req.profile},{encrypt_password:encrypt}))
  .then((doc)=>{
      //invalidate the current jwt token
    var  token=req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.SECRET);
    const blacklist=new BlackList({UserId:decoded._id,tokens:[{token:token}]});
    blacklist.save().then(()=>console.log("success"));
    return res.status(200).json({
        //send as a response 
            message:"Password Updated Successfully!",
            docs:doc
        })
    })
    .catch((err)=>{
        return res.status(403).json({
            message:"Error",
            error:err
        });
    });

};
//signout controller
exports.signout=(req,res)=>{
    //get the bearer token from request header 
    const Bearertoken=req.headers.authorization.split(" ")[0];
    if(Bearertoken=='Bearer'||Bearertoken=='bearer')
    {
       //verify the jwt token
        var  token=req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
    }
    //save this token into the database so no one can be authorized with this token again
    const blacklist=new BlackList({UserId:decoded._id,tokens:[{token:token}]});
    blacklist.save().then(()=>{res.json({
        message:"user has signed out"
    })})
    .catch((e)=>{
        return res.status(403).json({
            message:"Error in Signing Out",
            error:e
        });
    });
};


