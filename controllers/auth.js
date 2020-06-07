const express=require("express");
const router=express.Router();
//models
const User=require("../models/users");
const BlackList=require("../models/blacklists");
//packages
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
         
         email:users.email,
         id:users._id
     });
 })

};
 exports.checkBlackListTokens=(req,res,next)=>{
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
        console.log(docs.length);
        if(docs.length==0)
        {
     
            next();
           
        }
        else{
            return res.status(403).json({
                message:"invalid token",
                error:err
            });
        }
    
        
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
exports.isSignedIn=expressJwt({
    secret:process.env.SECRET,
    userProperty:"auth" //it holds the user _id which is generated when the user is signed in
});

exports.isAuthorized=(req,res,next)=>{
    //req.user is set when user is singed in and req.auth is present in isSignedIn
    let checker=req.profile && req.auth && req.profile==req.auth._id;
    console.log(checker);
    if(!checker)
    {   
        return res.status(403).json({
            "message":"Access Denied"
        })

    }
    next();
};
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
        if(!docs.authenticate(password))
        {
            console.log(err);
            return res.status(401).json({
                err:"Email and password does not exists"
            });
        }
        encrypt=docs.securePassword(changepassword);
    })
    .then(()=> User.updateOne({_id:req.profile},{encrypt_password:encrypt}))
  .then((doc)=>{
    var  token=req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, process.env.SECRET);
    const blacklist=new BlackList({UserId:decoded._id,tokens:[{token:token}]});
    blacklist.save().then(()=>console.log("success"));
    return res.status(200).json({
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

}
exports.signout=(req,res)=>{
    const Bearertoken=req.headers.authorization.split(" ")[0];
    console.log(Bearertoken);
    if(Bearertoken=='Bearer'||Bearertoken=='bearer')
    {
       
        var  token=req.headers.authorization.split(" ")[1];
        var decoded = jwt.verify(token, process.env.SECRET);
    }
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
    
}


