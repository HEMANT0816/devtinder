const mongoose=require("mongoose");
const validator=require("validator")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:3,
        trim:true,

    },
    lastName:{
        type:String,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:(value)=>{
            const isMail=validator.isEmail(value);

            if(!isMail){
                throw new Error("it is not a valid email")
            }
        }
        
    },
    gender:{
        type:String,

        validate:(value)=>{
            if(!["Male","Female","Other"].includes(value)){
                throw new Error("Invalid Gender")
            }
        }

    },
    age:{
        type:Number,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate:(value)=>{
            const isStrongPassword=validator.isStrongPassword(value);

            if(!isStrongPassword){
                throw new Error("it is not a Strong Password")
            }
        }
    },

    about:{
        type:String,
        trim:true,
        default:"Eager to Make New Friends"
    },
    skills:{
        type:[String],
    }

}) ;

const User=mongoose.model("user",userSchema);

module.exports=User;