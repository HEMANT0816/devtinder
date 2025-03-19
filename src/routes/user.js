const express =require("express");

const Router=express.Router();


//fetching controllers 
const {userSignUp,userLogin,updateUser}=require("../controller/user")

//fetching Middleware

const {Auth}=require("../middleware/Auth")



//making routes

Router.post("/signup",userSignUp);
Router.post("/login",userLogin);
Router.patch("/user",Auth,updateUser);


//exporting the routes;

module.exports=Router;