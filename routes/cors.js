const express=require("express");
const cors=require("cors");
const app=express();
//set your url to which you want to accept cross origin
const whitelist=['http://localhost:4000'];
var setCorsOption=(req,callback)=>{
    var corsOptions;
    if(whitelist.indexOf(req.header('Origin'))!==-1)
    {
        //accepting the cross origin
        corsOptions={origin:true};
    }
    else{
        corsOptions={origin:false};
    }
    callback(null,corsOptions)

};

exports.cors=cors();//any domain can access with url if used cors
exports.corsWithOptions=cors(setCorsOption);

