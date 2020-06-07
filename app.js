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
const listRoutes=require("./routes/lists");
//custom cors
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept,Authorization");
    if(req.method==="OPTIONS")
    {
        res.header("Access-Control-Allow-Method","GET,POST,PUT,DELETE,PATCH");
        return res.status(200).json({});
    }
    next();
});
//custom middlewares 
app.use("/api",authRoutes);
app.use("/api",taskRoutes);
app.use("/api",listRoutes);
//error handler
app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
});
//server listening port
const port=process.env.PORT||4000;
app.listen(port,()=>{
    console.log("server started successfully");
})