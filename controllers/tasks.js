const express=require("express");
const app=express();
const bodyParser=require("body-parser");
//models
const Task=require("../models/tasks");
//middlewares
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());
//add task
exports.addTask=(req,res)=>{
    const id=req.profile._id;
    console.log(id);
     const {name,tags}=req.body;
     console.log(name,tags);
     const tasks=new Task({id:id,name:req.query.name,tags:req.query.tags,dueDate:req.query.date});
     tasks.save((err,added)=>{
         if(err||!added){
             console.log(err);
             return res.status(403).json({
                 message:"No Task Have Been Added"
             });
         }
         res.json({
            message:"Task Have Been Added Successfully"
        });
     })
};

exports.getTask=(req,res)=>{
        
    Task.find({},(err,tasks)=>{
        if(err || !tasks)
        {
            return res.status(403).json({
                message:"No Task Found"
            });
        }

    res.json(tasks);
    });
};

exports.getTagName=(req,res,next)=>{
    req.tagname=req.params.tag;
    next();
};

exports.getTaskByTag=(req,res)=>{
    console.log(req.tagname);
    Task.find({tags:req.tagname},(err,tasks)=>{
        if(err || !tasks)
        {
            return res.status(403).json({
                message:`No Task Found at ${tasks}`
            })
        }
        res.json(tasks);
    });

};

exports.update=(req,res)=>{

 //old approach -failed
    // Task.findOne({name:req.tagname},(err,tasks)=>{
    //     if(err || !tasks)
    //     {
    //         return res.status(403).json({
    //             message:`No Task Found at ${tasks}`
    //         })
    //     }
    //     //console.log(tasks);
    //     req.tag_id=tasks._id;
    //     console.log(req.tag_id);
    // })
    // .updateOne({_id:req.tag_id},{$set:{name:req.body.name,tags:req.body.tags}},(err,updated)=>{
    //     if(err || !updated)
    //     {
    //         return res.status(403).json({
    //             message:`Task have not been updated`
    //         }) 
    //     }
    //     res.json({
    //         message:"Success fully updated",
    //         user:updated
    //     })
    // })

    //new approach -->using promises
    Task.findOne({name:req.tagname})
    .then(doc=> Task.updateOne({_id:doc._id},{name:req.query.name,tags:req.query.tags,dueDate:req.query.date}))
    .then(doc=> res.json({
        message:"Updated Successfully"
    }));
};

exports.deleteTask=(req,res)=>{
    Task.findOne({name:req.tagname})
    .then(doc=>Task.deleteOne({_id:doc._id}))
    .then(()=> res.json({
        message:"Deleted Successfully"
    }));
  
};