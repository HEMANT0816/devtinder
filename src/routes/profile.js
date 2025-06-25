const express=require("express");

const profileRouter =express.Router();

const {Auth}=require("../middleware/Auth")
const upload=require("../middleware/upload")

//getting handler

const {viewProfile,editProfile,editPassword,Testing}=require("../controller/profile")
const {getUserData}=require("../controller/user")
//defining routes
profileRouter.get("/view",Auth,viewProfile);
profileRouter.patch("/edit",Auth,upload.single("photo"),editProfile)
profileRouter.patch("/editPassword",Auth,editPassword)
profileRouter.post("/testing",Auth,upload.single("photo"),Testing);
profileRouter.get("/userdata/:userId",Auth,getUserData)

module.exports=profileRouter;

