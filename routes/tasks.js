const express=require("express");
const router=express.Router();

//controllers
const {isSignedIn,isAuthorized}=require("../controllers/auth");
const {getId}=require("../controllers/users");
const {addTask,getTask,getTaskByLabel,update,deleteTask,getTagName}=require("../controllers/tasks");
//params
router.param("userId",getId);
router.param("tag",getTagName);
//post task
router.post("/task/addTask/:userId",isSignedIn,isAuthorized,addTask);
//get task
router.get("/task/getTask/:userId",isSignedIn,isAuthorized,getTask);
//get task by tag
router.get("/task/getTaskByTags/:userId/:tag",isSignedIn,isAuthorized,getTaskByLabel);
//update task
router.put("/task/update/:userId/:tag",isSignedIn,isAuthorized,update);
//delete task
router.delete("/task/delete/:userId/:tag",isSignedIn,isAuthorized,deleteTask);

module.exports=router;