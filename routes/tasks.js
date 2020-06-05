const express=require("express");
const router=express.Router();
//import cors file
const cors=require("./cors");
//controllers
const {isSignedIn,isAuthorized}=require("../controllers/auth");
const {getId}=require("../controllers/users");
const {addTask,getTask,update,deleteTask,getTagName,getTaskByStatus}=require("../controllers/tasks");
//params
//router.param("userId",getId);
router.param("tag",getTagName);

//post task
router.post("/task/addTask/",cors.corsWithOptions,getId,isSignedIn,isAuthorized,addTask);
//get task
router.get("/task/getTask/",cors.corsWithOptions,getId,isSignedIn,isAuthorized,getTask);
// //get task by label
// router.get("/task/getTaskByTags/:userId/:tag",isSignedIn,isAuthorized,getTaskByLabel);
//get task by status
router.get("/task/getTaskByStatus",cors.corsWithOptions,getId,isSignedIn,isAuthorized,getTaskByStatus);
//update task
router.put("/task/update",cors.corsWithOptions,getId,isSignedIn,isAuthorized,update);
//delete task
router.delete("/task/delete",cors.corsWithOptions,getId,isSignedIn,isAuthorized,deleteTask);

module.exports=router;