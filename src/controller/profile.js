const User=require("../model/user")



const viewProfile=async (req,res)=>{


    try {

        const userId=req.userId;
        console.log(userId)

        const userData=await User.findById(userId);

        if(!userData){
            throw new Error("Please Login first")
        }

        userData.password="";

        res.json({
            message:"fetching Data Successfull",
            data:userData
        })
        
    } catch (error) {
        res.json({
            message:"problem in getting the profile data"+error.message,
        })
    }
}

const editProfile=async (req,res)=>{
    try {

        const isValidUpdate=validateUserInputForEditProfile(req);

        //now just make a updated user

        if(!isValidUpdate){
            throw new Error("Invalid Edit")
        }

        const updateUser=req.user;


        Object.keys(req.body).forEach((key)=>{updateUser.key=req.body[key]});

        await updateUser.save();

        res.json({
            message:"User Updated Successfully",
            data:updateUser

        })

        
    } catch (error) {
        res.json({
            message:"problem occur while updating is ->"+error.message
        })
    }
}

module.exports={viewProfile,editProfile};