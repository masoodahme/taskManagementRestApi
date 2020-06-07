const mongoose=require("mongoose");
const Schema=mongoose.Schema;
//to store tasks
const TaskSchema=new Schema({
      UserId:{
          type:String,
          required:true
      },
      description:{
          type:String,
          required:true
      },
      dueDate:{
          type:String,
          required:true
      },
      priority:{
          type:Number,
          required:true
      },
      status:{
          type:Number,//0-->new,1-->in-progress,2-->completed
          required:true
      },
      list:{
          type:String,
          required:true
      }
},{timestamps:true});
//export the userschema module
module.exports=mongoose.model("tasks",TaskSchema);