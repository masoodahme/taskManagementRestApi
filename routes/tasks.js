const express=require("express");
const router=express.Router();
//import cors file
// const cors=require("./cors");
//controllers
const {isSignedIn,isAuthorized,checkBlackListTokens}=require("../controllers/auth");
const {getId}=require("../controllers/users");
const {addTask,getTask,update,deleteTask,getTaskByStatus,searchTask,getTaskByDate}=require("../controllers/tasks");

//live searh
router.get("/search",getId,isSignedIn,checkBlackListTokens,isAuthorized,searchTask);
//post task
// router.post("/task/addTask/",cors.corsWithOptions,getId,isSignedIn,checkTokens,isAuthorized,addTask);
router.post("/task/addTask/",getId,isSignedIn,checkBlackListTokens,isAuthorized,addTask);
//get task
// router.get("/task/getTask/",cors.corsWithOptions,getId,isSignedIn,checkTokens,isAuthorized,getTask);
router.get("/task/getTask/",getId,isSignedIn,checkBlackListTokens,isAuthorized,getTask);
//get task by dueDate
router.get("/task/getTaskByDate",getId,isSignedIn,checkBlackListTokens,isAuthorized,getTaskByDate);
//get task by status
// router.get("/task/getTaskByStatus",cors.corsWithOptions,getId,isSignedIn,checkTokens,isAuthorized,getTaskByStatus);
router.get("/task/getTaskByStatus",getId,isSignedIn,checkBlackListTokens,isAuthorized,getTaskByStatus);
//update task
// router.put("/task/update",cors.corsWithOptions,getId,isSignedIn,checkTokens,isAuthorized,update);
router.put("/task/update",getId,isSignedIn,checkBlackListTokens,isAuthorized,update);

//delete task
// router.delete("/task/delete",cors.corsWithOptions,getId,isSignedIn,checkTokens,isAuthorized,deleteTask);
router.delete("/task/delete",getId,isSignedIn,checkBlackListTokens,isAuthorized,deleteTask);

module.exports=router;