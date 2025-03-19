const validator=require("validator");


const userSignUpValidation=(req)=>{
    const {firstName,lastName,email,password,age,gender}=req.body;

    if(!firstName){
        throw new Error("Please fill the name ");
    }

    if(!email){
        throw new Error("plese fill the email");
    }
    if(!password){
        throw new Error("Please fill the password");
    }
    if(!gender){
        throw new Error("Please fill the gender");       
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a Strong Password minimum 8 length having special charcter")
    }


}


module.exports={userSignUpValidation};