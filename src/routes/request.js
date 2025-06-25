const express=require("express");

const requestRoutes=express.Router();
const {Auth}=require("../middleware/Auth.js")

const {sendConnectionRequest,reviewConnectionRequest,getAllConnectionRequest ,userFeed,pendingRequests}=require("../controller/request.js");

//routes

requestRoutes.post("/send/:status/:receiverId",Auth,sendConnectionRequest);
requestRoutes.post("/review/:status/:requestId",Auth,reviewConnectionRequest);

requestRoutes.get("/get",Auth,getAllConnectionRequest);

requestRoutes.get("/feed",Auth,userFeed);
requestRoutes.get("/pending",Auth,pendingRequests);

module.exports=requestRoutes;