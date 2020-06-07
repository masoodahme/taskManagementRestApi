const express=require("express");
const router=express.Router();

const {isSignedIn,isAuthorized,checkBlackListTokens}=require("../controllers/auth");
const {getId}=require("../controllers/users");
const {addList,getList,deleteList}=require("../controllers/lists");

//add list
router.post("/list/addList",getId,isSignedIn,checkBlackListTokens,isAuthorized,addList);
//get List
router.get("/list/getList",getId,isSignedIn,checkBlackListTokens,isAuthorized,getList);
//delete list
router.delete("/list/deleteList",getId,isSignedIn,checkBlackListTokens,isAuthorized,deleteList);

module.exports=router;