const mongoose= require("mongoose");
const validator=require("validator");


const otpSchema=new mongoose.Schema({
    body:{
        type:String,
        trim:true,
        required:true,
    },

    userId:{
        type:String,
        trim:true,
        required:true,
        validate:(value)=>{
            const isMail=validator.isEmail(value);

            if(!isMail){
                throw new Error("it is not a valid email")
            }
        }
    },

    createdAt:{
        type:Date,
        default:Date.now,
        expires:"5m" // OTP will expire after 5 minutes
    }

});

module.exports=mongoose.model("Otp",otpSchema);

