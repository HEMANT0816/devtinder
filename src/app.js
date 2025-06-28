console.log("this is dev tinder project");

const express=require("express");
const database=require("./config/database");
const userRouter=require("./routes/user");
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");

var cors=require("cors");

const cookieParser=require("cookie-parser")

const User=require("./model/user");

const app=express();
require("dotenv").config();

app.use(cors(
    {
        origin: "http://13.60.236.250/4002", // Replace with your frontend URL
        credentials: true, // Allow cookies to be sent
    }
))


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


const PORT=process.env.PORT || 4002;
database.connect()
.then(()=>{
    console.log("Db connection Successfull")
    app.listen(PORT,()=>{
        console.log(`app is listening on port number ${PORT}`)
    })
})
.catch((err)=>console.log("Failure in db connection"));









