console.log("this is dev tinder project");

const express=require("express");

const app=express();

app.use((req,res)=>{
    res.send("hello from the server");
});


app.listen(3000,()=>{
    console.log("app is listening on port number 3000")
})