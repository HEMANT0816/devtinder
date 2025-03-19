console.log("this is dev tinder project");

const express=require("express");
const database=require("./config/database");
const Router=require("./routes/user");

const cookieParser=require("cookie-parser")

const User=require("./model/user");

const app=express();

app.use(express.json());
app.use(cookieParser()); 

require("dotenv").config();


app.get("/",(req,res)=>{
    res.send("server is listening your request")
})

// console.log("user->",User)
app.use(Router);

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









