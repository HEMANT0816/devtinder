const mongoose=require("mongoose");


const connect= async ()=>{

    mongoose.connect("mongodb+srv://hemantsain:Dkv1YOSOY9EAV2F4@dummycluster.xx2x1zz.mongodb.net/devtinder")

}

module.exports={connect};