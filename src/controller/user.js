const User=require("../model/user");
const {userSignUpValidation}=require("../helper/user");
const bcrypt=require("bcrypt");
const JWT=require("jsonwebtoken");
const ConnectionRequest=require("../model/ConnectionRequest")
const validator = require("validator");
const Otp = require("../model/Otp");
const sendEmail = require("../helper/sendGmail"); 
require("dotenv").config();

const SECRET_KEY=process.env.SECRET_KEY;

const sendOtp=async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        // Check if the email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Check if the OTP is a valid 6-digit number
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: "Invalid OTP format" });
        }
        //hash the OTP
        const hashedOtp = await bcrypt.hash(otp, 10);

        console.log(sendEmail);
        //send the OTP to the user's email

        await sendEmail.sendGmail(email, "Your OTP Code", `Your OTP code is: ${otp}`);
        
        //check if the OTP already exists for the user
        const existingOtp = await Otp.findOne({ userId: email });
        if (existingOtp) {   
            // If an OTP already exists, update it
            existingOtp.body = hashedOtp;
            await existingOtp.save();
        } else {
            // If no OTP exists, create a new one
            const otpInstance = new Otp({
                body: hashedOtp,
                userId: email
            });
            await otpInstance.save();
        }

        console.log(`OTP for ${email}: ${otp}`);

        res.status(200).json({  
            message: "OTP sent successfully",
            otp: otp // For testing purposes, you might want to remove this in production
        });
    } catch (error) {
        res.status(500).json({
            message: "Error sending OTP",
            error: error.message
        });
        
    }
}


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

const getUserData=async (req,res)=>{
    try {
        const userId=req.userId;

        const userFeed=req.params.userId;



        if(userId===userFeed){
            throw new Error("You can feed yourself")
        }

        const notvalidStatus=["ignore","rejected"]

        const connectionRequests = await ConnectionRequest.find({
                    
                        $or: [
                        { senderId: userId, status: $or["ignore","rejected"] },
                        { receiverId: userId, status: $or["ignore","rejected"] }
                        ]
                       
                }).select('senderId receiverId').lean(); // lean() for performance if you don't need mongoose doc methods
        
                const userIds = new Set();
        
                connectionRequests.forEach((request) => {
                    
                        userIds.add(request.senderId.toString());
                        userIds.add(request.receiverId.toString());
                    
                });

                if(userIds.include(userFeed)){
                    throw new Error("cant see their profile")
                }

                const userData=User.findById(userFeed);

                res.json({
                    data:userData
                })




        

        
    } catch (error) {
        console.log("cant able to retrieve the data of the user");

        res.status(401).json(
            {message:error.message}
        )
    }
};


module.exports={userSignUp,userLogin,updateUser,logout,getUserData,sendOtp};