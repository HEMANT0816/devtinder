const JWT=require("jsonwebtoken")

const User=require("../model/user")

const Auth=async (req,res,next)=>{

try {
    const cookieToken=req.cookies.token;




if(!cookieToken){
    throw new Error("login required")
}

const data = await JWT.verify(cookieToken,"Hemant0816@")

if(!data){
    throw new Error("login required")
}

req.userId=data.UserID;
const user=await User.findById(data.UserID);

req.user=user;





next(); 

} catch (error) {
    res.status(401).json(
        {
            message:"can't Perform These action due to->"+error.message
        }
    )
}

}

module.exports={Auth}