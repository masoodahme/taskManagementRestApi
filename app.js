require("dotenv").config();
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cookieParser = require('cookie-parser');
var cors = require('cors')
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
app.use(cors());
//routes
const authRoutes=require("./routes/auth");
const taskRoutes=require("./routes/tasks");
//custom middlewares 
app.use("/api",authRoutes);
app.use("/api",taskRoutes);
//server listening port
const port=process.env.PORT||4000;
app.listen(port,()=>{
    console.log("server started successfully");
})