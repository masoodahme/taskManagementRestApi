const mongoose=require("mongoose");

const Schema=mongoose.Schema;
//to store blacklisted tokens
const BlackListSchema=new Schema({
      UserId:{
          type:String,
          required:true
      },
      tokens:[{
          token:{
              type:String,
              require:true
          }
      }]
},{timestamps:true});
//expires the document after 7 days
BlackListSchema.index({createdAt:1},{expireAfterSeconds:604800});
module.exports=mongoose.model("blacklist",BlackListSchema);