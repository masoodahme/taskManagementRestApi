const mongoose=require("mongoose");
const Schema=mongoose.Schema;
//list schema
const ListSchema=new Schema({
    UserId:{
        type:String,
        required:true
    },
    lists:{
        type:String,//store the labels such as personal,work,..etc
        required:true
    }
},{timestamps:true});

//export the userschema module
module.exports=mongoose.model("lists",ListSchema);