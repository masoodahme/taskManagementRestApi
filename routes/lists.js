const express=require("express");
//create the router for list
const router=express.Router();
//controllers
const {isSignedIn,isAuthorized,checkBlackListTokens}=require("../controllers/auth");
const {getId}=require("../controllers/users");
const {addList,getList,deleteList}=require("../controllers/lists");
//lists routes
//add list
router.post("/list/addList",getId,isSignedIn,checkBlackListTokens,isAuthorized,addList);

//get List
router.get("/list/getList",getId,isSignedIn,checkBlackListTokens,isAuthorized,getList);

//delete list
router.delete("/list/deleteList",getId,isSignedIn,checkBlackListTokens,isAuthorized,deleteList);

//export the router
module.exports=router;