const User=require("../model/user");
const {userSignUpValidation}=require("../helper/user");
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");

require("dotenv").config();

const SECRET_KEY=process.env.SECRET_KEY;




const userSignUp =async (req,res)=>{

    try {
        const {firstName,lastName,email,password,age,gender}=req.body;
    //  form helper

    userSignUpValidation(req);

    //password encryption

    const hashedPassword =await bcrypt.hash(password,10);

    //creating the the instance of my model

    const user=User({firstName,lastName,email,password:hashedPassword,age,gender});

    //save the user

    const newUser=await user.save();

    res.status(201).json({
        message:"user created success",
        data:newUser,
        
    })

    } catch (error) {
        res.json({
            message:"user signup failed due to ->"+error.message
        })
    }

};

const userLogin=async (req,res)=>{
    try {

        const {email,password}=req.body;
        //req validation
        if(!email||!password){
            throw new Error("Email and Password Both required");
        }
        //find for the user

        const user=await User.findOne({email:email});

        if(!user){
            throw new Error("Invalid Credentials")
        }

        //checking the password

        const isPasswordMatch=await bcrypt.compare(password,user.password);

        if(!isPasswordMatch){
            throw new Error("Invalid Credential")
        }

        const token= await user.getJwtToken();
      

        res.cookie('token', token, { 
            httpOnly: true,   // Prevents access from JavaScript (security)
            // secure: true,     // Ensures it's sent only over HTTPS
            // sameSite: 'None', // Cross-origin cookies need 'None' + Secure
            maxAge: 24 * 60 * 60 * 1000 // 1 day
          });


        res.json({
            message:"user login suceessfully",
            data:user
        })
        
    } catch (error) {
        res.json({
            message:"Login failed due to ->"+error.message
        })
    }

}

const updateUser =async (req,res)=>{
    try {
        
        const {skills,about}=req.body;
        const userId=req.userId;

        var user;

        if(skills&&!about){
            user= await User.findByIdAndUpdate(userId,{skills});
        }
        if(!skills&&about){
            user= await User.findByIdAndUpdate(userId,{about});
        }
        if(skills&&about){
            user= await User.findByIdAndUpdate(userId,{skills,about});
        }

        if(!user){
            throw new Error("cant update the user due to error->"+error.message)
        }

        // if(skills&&!about){
        //     const data=await User.findByIdAndUpdate(userID)
        // }

        res.json({
            message:"user Updated Successfull",
            data:user
        });

    } catch (error) {
        res.json({
            message:"Cant Update user due to->"+error.message
        })
    }
}


const logout=async(req,res)=>{
    try {
        
        // res.send("hi")

        res.cookie("token", null, {
    expires: new Date(Date.now()),
  })
  .json({message:"Logout Successful"});

    } catch (error) {
        res.send("error",error.message)
    }
}


module.exports={userSignUp,userLogin,updateUser,logout}