import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import User from "./userSchema.js";
import crypto from "crypto";

const ResetPassword = asyncHandler(async(req,res)=>{
    
    // Extracting resetToken that was send as the url through the mail from req.params object
    const { resetToken } = req.params;
  
    // Extracting password from req.body object
   // console.log(req.body);
    const { password , confirm } = req.body;
     if(password!=confirm){
      const data = {
        date:new Date().getFullYear(),
        errors:true,
        errormsg:"Password and Confirm Password doesnt match",
        params:resetToken,
    }
  
  res.render("ResetPassword.ejs",data);
     }
  
    // We are again hashing the resetToken using sha256 since we have stored our resetToken in DB using the same algorithm
    const forgotPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
  
  
    // Check if password is not there then send response saying password is required
    if (!password) {
      console.log("error");
    }
  
    console.log(forgotPasswordToken);

  
    // Checking if token matches in DB and if it is still valid(Not expired)
    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() }, // $gt will help us check for greater than value, with this we can check if token is valid or expired
    });
  
    // If not found or expired send the response
    if (!user) {
      console.log("token invalid");
    }
  
    // Update the password if token is valid and not expired
    user.password = password;
  
    // making forgotPassword* valus undefined in the DB
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
  
    // Saving the updated user values
    await user.save();
  
    // Sending the response when everything goes good

    const data = {
      date:new Date().getFullYear(),
      errors:true,
      errormsg:"Password updated please relogin!",
      params:resetToken,
      err:"Please remember the password",
      errors:true,
      src:"https://tse1.mm.bing.net/th?id=OIP.1jkmnxXg6sT_ifiehDLgngHaHa&pid=Api&rs=1&c=1&qlt=95&w=123&h=123",
  }

res.render("loginPage.ejs",data);
      
  });

  export {ResetPassword} ;
