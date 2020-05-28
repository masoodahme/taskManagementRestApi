const mongoose=require("mongoose");

const Schema=mongoose.Schema;

const TaskSchema=new Schema({
      id:{
          type:String,
          required:true
      },
      name:{
          type:String,
          required:true
      },
      tags:{
          type:String,
          required:true
      }
},{timestamps:true});

module.exports=mongoose.model("tasks",TaskSchema);