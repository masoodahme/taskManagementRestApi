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
    const id=req.profile;
    console.log(id);
     const {description,dueDate,priority,status,list}=req.body;
     //console.log(name,labels);
     const tasks=new Task({UserId:id,description:description,dueDate:dueDate,priority:priority,status:status,list:list});
     tasks.save((err,task)=>{
         if(err||!task){
             console.log(err);
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
//get all the task from database
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
//get task by dueDate
exports.getTaskByDate=(req,res)=>{
    let pageNumber=req.query.pageno||0;
    console.log(req.query.date);
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
//get the task based on status from the database
exports.getTaskByStatus=(req,res)=>{
    let pageNumber=req.query.pageno||0;
    console.log(req.query.list,req.query.status);
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
    // Task.findOne({_id:req.query.taskid})
    // .then(doc=> Task.updateOne({_id:doc._id},{name:req.body.name,labels:req.body.labels,status:req.body.status,dueDate:req.body.date}))
    // .then(doc=> res.json({
    //     message:"Updated Successfully"
    // }))
    // .catch(()=> res.status(403).json({
    //     message:"Updation Failed"
    // }));
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
//Search Task
exports.searchTask=(req,res)=>{
    console.log(req.profile);
    Task.find({UserId:req.profile})
    .then((docs)=>Task.find({UserId:req.profile,list:req.query.list,description:{$regex:req.query.desc,$options:"i"}}))
    .then((doc)=>{
        doc.forEach((elem)=>console.log(elem));
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
//delete the task
exports.deleteTask=(req,res)=>{
    // Task.findOne({name:req.tagname})
    // .then(doc=>Task.deleteOne({_id:doc._id}))
    // .then(()=> res.json({
    //     message:"Deleted Successfully"
    // }))
    // .catch(()=> res.status(403).json({
    //     message:"Deletion Failed"
    // }));
    Task.findOneAndDelete({_id:req.query.taskid})
    .then(doc=>res.status(200).json({
        message:"Deleted Successfully"
    }))
    .catch(()=>res.status(403).json({
        message:"Deletion Failed"
    }));
};