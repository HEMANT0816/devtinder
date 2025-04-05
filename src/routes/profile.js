const express=require("express");

const profileRouter =express.Router();

const {Auth}=require("../middleware/Auth")

//getting handler

const {viewProfile,editProfile,editPassword}=require("../controller/profile")
//defining routes
profileRouter.get("/view",Auth,viewProfile);
profileRouter.patch("/edit",Auth,editProfile)
profileRouter.patch("/editPassword",Auth,editPassword)

module.exports=profileRouter;

