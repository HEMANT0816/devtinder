const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();
const getPublicId = (url) => {
  const parts = url.split('/');
  const lastTwo = parts.slice(-2); // Get last two elements
  const fileName = lastTwo[1].split('.')[0]; // Remove extension from filename
  return `${lastTwo[0]}/${fileName}`;
};



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY
});

const uploadPhoto = (fileBuffer, folderName = 'devtinder') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          reject(new Error(error.message || 'Cloudinary upload failed'));
        } else {
          resolve(result);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const deleteImage = async (secureUrl) => {
  console.log('Deleting image with URL:', secureUrl);
  try {
    // Extract public_id from URL
    const publicId = getPublicId(secureUrl);

    // const publicId="devtinder/fjmw2m18aobjczvtublg"

    // Call cloudinary delete  
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Delete result:', result);
  } catch (error) {  
    console.error('Error deleting image:', error);
  }
};

module.exports = { uploadPhoto, deleteImage };
