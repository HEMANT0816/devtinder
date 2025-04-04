const express =require("express");

const Router=express.Router();


//fetching controllers 
const {userSignUp,userLogin,updateUser,logout}=require("../controller/user")

//fetching Middleware

const {Auth}=require("../middleware/Auth")



//making routes

Router.post("/signup",userSignUp);
Router.post("/login",userLogin);
Router.patch("/user",Auth,updateUser);
Router.post("/logout",logout);


//exporting the routes;

module.exports=Router;