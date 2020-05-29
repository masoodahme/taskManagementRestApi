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
     const {name,labels,dueDate,status}=req.body;
     //console.log(name,labels);
     const tasks=new Task({id:id,name:name,labels:labels,status:status,dueDate:dueDate});
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
//get all the task from database
exports.getTask=(req,res)=>{ 
    Task.find({ name: { $exists: true} },(err,tasks)=>{
        if(err) return res.status(403).json({message:"No Task Found"});
        if(!tasks) return res.status(403).json({
            message:"No Task Found"
        })
   res.json(tasks);
    });


};

exports.getTagName=(req,res,next)=>{
    req.tagname=req.params.tag;
    next();
};
//get the task based on labels from the database 
exports.getTaskByLabel=(req,res)=>{
    console.log(req.tagname);
    Task.find({labels:req.tagname},(err,tasks)=>{
        if(err || !tasks)
        {
            return res.status(403).json({
                message:`No Task Found at ${tasks}`
            })
        }
        res.json(tasks);
    });

};
//get the task based on status from the database
exports.getTaskByStatus=(req,res)=>{
        Task.find({status:req.query.status})
        .then(tasks=>res.status(200).json(tasks))
        .catch(()=>res.status(403).json({
        message:`No Task Found at ${req.query.status}`
        }))
};
//update the task
exports.update=(req,res)=>{
    Task.findOne({name:req.tagname})
    .then(doc=> Task.updateOne({_id:doc._id},{name:req.body.name,labels:req.body.labels,status:req.body.status,dueDate:req.body.date}))
    .then(doc=> res.json({
        message:"Updated Successfully"
    }))
    .catch(()=> res.status(403).json({
        message:"Updation Failed"
    }));
};
//delete the task
exports.deleteTask=(req,res)=>{
    Task.findOne({name:req.tagname})
    .then(doc=>Task.deleteOne({_id:doc._id}))
    .then(()=> res.json({
        message:"Deleted Successfully"
    }))
    .catch(()=> res.status(403).json({
        message:"Deletion Failed"
    }));
  
};