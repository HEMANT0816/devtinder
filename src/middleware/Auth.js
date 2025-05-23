const JWT=require("jsonwebtoken")

const Auth=async (req,res,next)=>{

try {
    const cookieToken=req.cookies.token;


console.log("token->",cookieToken);

if(!cookieToken){
    throw new Error("login required")
}

const data = await JWT.verify(cookieToken,"Hemant0816@")

if(!data){
    throw new Error("login required")
}

req.userId=data.UserID

next(); 

} catch (error) {
    res.json(
        {
            message:"can't Perform These action due to->"+error.message
        }
    )
}

}

module.exports={Auth}