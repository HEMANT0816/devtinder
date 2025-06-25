const User = require("../model/user");
const { validateUserInputForEditProfile } = require("../helper/user");
const validator = require("validator");
const { uploadPhoto,deleteImage } = require("../helper/photosUpload");


const viewProfile = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);

    const userData = await User.findById(userId);

    if (!userData) {
      throw new Error("Please Login first");
    }

    userData.password = "";

    res.json({
      message: "fetching Data Successfull",
      data: userData,
    });
  } catch (error) {
    res.status(401).json({
      message: "problem in getting the profile data" + error.message,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    console.log("helo i am doing test");
    const isValidUpdate = validateUserInputForEditProfile(req);
    const file = req.file;
    const testing=req.file.buffer;

    // console.log("buffer->",file)
    // console.log("buffer- type>",typeof(testing))
    let updatedUrl;

    //now just make a updated user

    if (!isValidUpdate) {
      throw new Error("Invalid Edit");
    }

    const updateUser = req.user;
    Object.keys(req.body).forEach((key) => {
      updateUser[key] = req.body[key];
    });


    if (file) {
      console.log("file is present");
        const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`
        updatedUrl=await uploadPhoto(file.buffer);
        if(req.user.photoUrl!==updatedUrl.secure_url){
          console.log("deleting old image");
          await deleteImage(req.user.photoUrl);
        }
       updateUser.photoUrl=updatedUrl.secure_url;


    }

   

    await updateUser.save();

    updateUser.password = "";

    res.json({
      message: "User Updated Successfully",
      data: updateUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "problem occur while updating is ->" + error.message,
    });
  }
};

const editPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      throw new Error("Please fill the old and new password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      throw new Error(
        "Please enter a Strong Password minimum 8 length having special charcter"
      );
    }
    if (oldPassword === newPassword) {
      throw new Error("New Password should be different from old password");
    }
    const user = req.user;

    if (!user) {
      throw new Error("Please Login first");
    }

    const isMatch = await user.isValidPassword(oldPassword);

    if (!isMatch) {
      throw new Error("Old Password is not valid");
    }

    user.password = newPassword;

    await user.save();

    res.json({
      message: "password updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "problem occur while updating is ->" + error.message,
    });
  }
};

const Testing=async(req,res)=>{
  console.log("helo i am doing test");
  const file = req.file;
  const updatedUrl = await uploadPhoto(file.buffer);
  console.log(updatedUrl.secure_url);
  res.json({
    message:"hello i am testing",
    data: updatedUrl.secure_url
  })
}

module.exports = { viewProfile, editProfile, editPassword, Testing };
