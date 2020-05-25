require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cookieParser = require('cookie-parser')
const app=express();
//connection to DataBase
mongoose.connect(process.env.DB_CONNECTION,{
useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true})
.then(()=>{
    console.log("DB connected succesfully");
})


//middlewares
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
//routes
const authRoutes=require("./routes/auth");
//custom middlewares 
app.use("/api",authRoutes);
//server listening port
const port=process.env.PORT||3000;
app.listen(port,()=>{
    console.log("server started successfully");
})