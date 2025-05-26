const User=require("../model/user")
const {validateUserInputForEditProfile}=require("../helper/user")
const validator=require("validator")




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


        
     

        Object.keys(req.body).forEach((key)=>{
            updateUser[key]=req.body[key];
            
         });
        

        await updateUser.save();

        updateUser.password="";

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

const editPassword=async (req,res)=>{
    try {
        const {oldPassword,newPassword}=req.body;

        if(!oldPassword||!newPassword){
            throw new Error("Please fill the old and new password")
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please enter a Strong Password minimum 8 length having special charcter")
        }
        if(oldPassword===newPassword){
            throw new Error("New Password should be different from old password")
        }
        const user= req.user;

        if(!user){
            throw new Error("Please Login first")
        }

        const isMatch=await user.isValidPassword(oldPassword);

        if(!isMatch){
            throw new Error("Old Password is not valid")
        }

        user.password=newPassword;
        
        await user.save();

        res.json({
            message:"password updated successfully",
            data:user
        })
        
    } catch (error) {
        res.json({
            message:"problem occur while updating is ->"+error.message
        })
    }
}

module.exports={viewProfile,editProfile,editPassword};