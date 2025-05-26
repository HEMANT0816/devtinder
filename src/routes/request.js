const express=require("express");

const requestRoutes=express.Router();
const {Auth}=require("../middleware/Auth.js")

const {sendConnectionRequest,reviewConnectionRequest,getAllConnectionRequest ,userFeed}=require("../controller/request.js");

//routes

requestRoutes.post("/send/:status/:receiverId",Auth,sendConnectionRequest);
requestRoutes.post("/review/:status/:requestId",Auth,reviewConnectionRequest);

requestRoutes.get("/get",Auth,getAllConnectionRequest);

requestRoutes.get("/feed/:userId",Auth,userFeed);

module.exports=requestRoutes;