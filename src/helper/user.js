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

const validateUserInputForEditProfile=(req)=>{
    const validUpdate=["age","firstName","lastName","skills","about","photoUrl","gender"];

    const isValidUpdate =Object.keys(req.body).every((key)=>validUpdate.includes(key));

    if(req.skills && req.skills.length>10){
        throw new Error("Skills Can't be more than 50")
    };



    if(req.firstName && !validator.isLength(req.firstName,3)){
        throw new Error("First Name Should be of minimum length 3")
    };

    if(req.lastName && !validator.isLength(req.lastName,3)){
        throw new Error("last Name Should be of minimum length 3")
    };

    if(req.age && req.age<18 || req.age>60){
        throw new Error("Please enter valid age in between 18 to 60")
    };

    if (req.photoUrl && !validator.isURL(photoUrl)){
        throw new Error("Please Enter the valid Photo Url")
    }





    return validUpdate;
}


module.exports={userSignUpValidation};