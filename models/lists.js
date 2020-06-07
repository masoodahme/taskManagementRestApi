const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const ListSchema=new Schema({
    UserId:{
        type:String,
        required:true
    },
    lists:{
        type:String,
        required:true
    }
},{timestamps:true});


module.exports=mongoose.model("lists",ListSchema);