console.log("this is dev tinder project");

const express=require("express");
const database=require("./config/database");
const userRouter=require("./routes/user");
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")

const cookieParser=require("cookie-parser")

const User=require("./model/user");

const app=express();
require("dotenv").config();
//using middleware

app.use(express.json());
app.use(cookieParser()); 



//creating routes
app.get("/",(req,res)=>{
    res.send("server is listening your request")
})


app.use("/auth",authRouter)
app.use("/user",userRouter)
app.use("/request",requestRouter)
app.use("/profile",profileRouter)
// console.log("user->",User)


const SECRET_KEY=process.env.SECRET_KEY;

console.log(SECRET_KEY)



database.connect()
.then(()=>{
    console.log("Db connection Successfull")
    app.listen(4002,()=>{
        console.log("app is listening on port number 3000")
    })
})
.catch((err)=>console.log("Failure in db connection"));









