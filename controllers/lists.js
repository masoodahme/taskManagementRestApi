const express=require("express");
const app=express();
const bodyParser=require("body-parser");
//List model
const List=require("../models/lists");
//middlewares
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());

//add the list into the database
 exports.addList=(req,res)=>{
      const {list}=req.body;
      const id=req.profile;
      const lists=new List({UserId:id,lists:list});
      lists.save((err,list)=>{
        if(err||!list){
            return res.status(403).json({
                message:"No List Have Been Added"
            });
        }
        res.json({
           message:"List Have Been Added Successfully",
           list:list
       });
      })
 };
//get the list from the database
 exports.getList=(req,res)=>{
    List.find({UserId:req.profile})
    .exec(
    (err,lists)=>{
        if(err) return res.status(403).json({message:"No List Found"});
        if(!lists) return res.status(403).json({
            message:"No List Found"
        });
   res.json(lists);
    });

 };

 //delete the list from the database
 exports.deleteList=(req,res)=>{
    List.findOneAndDelete({_id:req.query.taskid})
    .then(doc=>res.status(200).json({
        message:"Deleted Successfully"
    }))
    .catch(()=>res.status(403).json({
        message:"Deletion Failed"
    }));

};