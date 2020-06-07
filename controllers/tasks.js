const express=require("express");
const app=express();
const bodyParser=require("body-parser");
//Task model
const Task=require("../models/tasks");
//middlewares
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(bodyParser.json());
 
//add task into the database
exports.addTask=(req,res)=>{
    const id=req.profile;
     const {description,dueDate,priority,status,list}=req.body;
     const tasks=new Task({UserId:id,description:description,dueDate:dueDate,priority:priority,status:status,list:list});
     //save the tasks into database
     tasks.save((err,task)=>{
         if(err||!task){
             return res.status(403).json({
                 message:"No Task Have Been Added"
             });
         }
         res.json({
            message:"Task Have Been Added Successfully",
            tasks:task
        });
     })
};

//get all the task from database with page limit
exports.getTask=(req,res)=>{ 
    let pageNumber=req.query.pageno||0;
    Task.find({UserId:req.profile,list:req.query.list})
    .sort({priority:-1,createdAt:-1})
    .skip(pageNumber*5)
    .limit(5)
    .exec(
    (err,tasks)=>{
        if(err) return res.status(403).json({message:"No Task Found"});
        if(!tasks) return res.status(403).json({
            message:"No Task Found"
        })
   res.json(tasks);
    });


};

//get the task by DueDate with page limit
exports.getTaskByDate=(req,res)=>{
    let pageNumber=req.query.pageno||0;
    Task.find({UserId:req.profile,list:req.query.list,dueDate:req.query.date})
    .sort({priority:-1,createdAt:-1})
    .skip(pageNumber*5)
    .limit(5)
    .exec(
    (err,tasks)=>{
        if(err) return res.status(403).json({message:"No Task Found"});
        if(!tasks) return res.status(403).json({
            message:"No Task Found"
        })
   res.json(tasks);
    });
}

//get the task based on status from the database  with page limit
exports.getTaskByStatus=(req,res)=>{
    let pageNumber=req.query.pageno||0;
        Task.find({list:req.query.list,status:req.query.status})
        .sort({priority:-1,createdAt:-1})
        .skip(pageNumber*5)
        .limit(5)
        .then(tasks=>res.status(200).json(tasks))
        .catch(()=>res.status(403).json({
        message:`No Task Found at ${req.query.status}`
        }))
};
//update the task
exports.update=(req,res)=>{
    Task.findByIdAndUpdate({_id:req.query.taskid},{$set:{description:req.body.description,dueDate:req.body.dueDate,
        priority:req.body.priority,status:req.body.status,list:req.body.list}},{new:true})
    .then(doc=> res.json({
        message:"updated Successfully",
        task:doc
    }))
    .catch(()=> res.status(403).json({
        message:"Updation Failed"
    }));
};
//get the task based on the search
exports.searchTask=(req,res)=>{
    Task.find({UserId:req.profile})
    .then((docs)=>Task.find({UserId:req.profile,list:req.query.list,description:{$regex:req.query.desc,$options:"i"}}))
    .then((doc)=>{
        res.status(200).json({
            descriptions:doc
        });
    })
    .catch((err)=>{
        res.status(403).json({
            message:"error in db",
            error:err
        })
    });
}
//delete the task from the database
exports.deleteTask=(req,res)=>{
    Task.findOneAndDelete({_id:req.query.taskid})
    .then(doc=>res.status(200).json({
        message:"Deleted Successfully"
    }))
    .catch(()=>res.status(403).json({
        message:"Deletion Failed"
    }));
};