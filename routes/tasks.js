const express=require("express");
//create router for task
const router=express.Router();
//controllers
const {isSignedIn,isAuthorized,checkBlackListTokens}=require("../controllers/auth");
const {getId}=require("../controllers/users");
const {addTask,getTask,update,deleteTask,getTaskByStatus,searchTask,getTaskByDate}=require("../controllers/tasks");
//tasks routes
//live searh
router.get("/search",getId,isSignedIn,checkBlackListTokens,isAuthorized,searchTask);

//add the task into database
router.post("/task/addTask/",getId,isSignedIn,checkBlackListTokens,isAuthorized,addTask);

//get the tasks from the database 
router.get("/task/getTask/",getId,isSignedIn,checkBlackListTokens,isAuthorized,getTask);

//get the tasks by dueDate
router.get("/task/getTaskByDate",getId,isSignedIn,checkBlackListTokens,isAuthorized,getTaskByDate);

//get the tasks by status
router.get("/task/getTaskByStatus",getId,isSignedIn,checkBlackListTokens,isAuthorized,getTaskByStatus);

//update the  task
router.put("/task/update",getId,isSignedIn,checkBlackListTokens,isAuthorized,update);

//delete the task from database
router.delete("/task/delete",getId,isSignedIn,checkBlackListTokens,isAuthorized,deleteTask);

//export the router
module.exports=router;