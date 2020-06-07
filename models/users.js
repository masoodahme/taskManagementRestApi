const mongoose=require("mongoose");
const crypto=require("crypto");
const { v1: uuidv1 } = require('uuid');
const Schema=mongoose.Schema;
//user schema
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
//set the pasword
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
    //compare the password
    authenticate:function(password){
        return this.securePassword(password)===this.encrypt_password;
    },
    //encrypt the password
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
//export the userschema module

module.exports=mongoose.model("user",userSchema);