const cloudinary = require('cloudinary').v2;




cloudinary.config({
  cloud_name: process.env.CLOUD_NAME||"dmrzlkwx4", 
  api_key: process.env.API_KEY_CLOUDINARY||"136824458218583", 
  api_secret: process.env.API_SECRET_CLOUDINARY||"MPKajj9hX2AM_fjcNYG4fFIiDdA"
})

const uploadPhoto=(URL)=>{
const result=cloudinary.uploader.upload(URL, function(error, result) {
  if (error) {
    console.error('Upload failed:', error);
  } else {
    console.log("upload file succefull");
    return result;
  }

  
});

return result;


}

module.exports={uploadPhoto}