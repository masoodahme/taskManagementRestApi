const mongoose=require("mongoose");
const crypto=require("crypto");
// const uuidv1=require("uuid/v1");
const { v1: uuidv1 } = require('uuid');
const Schema=mongoose.Schema;

var userSchema=new Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    encrypt_password:{
        type:String,
        required:true
    },
    salt:String
},{timestamps:true });

userSchema.virtual("password")
  .set(function(password){
      //_password is private variable to store the password
      this._password=password;
      this.salt=uuidv1();
      this.encrypt_password=this.securePassword(password);
  })
  .get(function(){
      return this._password;
  })

userSchema.methods={
    authenticate:function(password){
        return this.securePassword(password)===this.encrypt_password;
    },
    securePassword:function(plainPassword){
        if(!plainPassword) return "";
        try{
            return crypto.createHmac("sha256",this.salt)
            .update(plainPassword)
            .digest("hex");
        }
        catch(err){
            console.log("error in password");
        }
      
    }
}

module.exports=mongoose.model("user",userSchema);