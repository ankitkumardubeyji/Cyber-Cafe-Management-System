
import User from "./userSchema.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import sendEmail from "./sendEmail.js";

const forgetPassword = asyncHandler(async (req, res, next) => {
    // Extracting email from request body
    const { email } = req.body;
  
    // If no email send email required message
    if (!email) {

        const data = {
            date:new Date().getFullYear(),
            errors:true,
            errormsg:"Email required",
        }

      res.render("forget.ejs",data);
    }
  
    // Finding the user via email
    const user = await User.findOne({
      email
    }).select('+password'); 
  
    // If no email found send the message email not found
    if (!user) {
        const data = {
            date:new Date().getFullYear(),
            errors:true,
            errormsg:"No any such email registered ",
        }

      res.render("forget.ejs",data);
    }
  
  
    // Generating the reset token via the method we have in user model
    const resetToken = await user.generatePasswordResetToken();
    console.log("hre");
  
    // Saving the forgotPassword* to DB
    console.log(user);
    await user.save();
    console.log("ok");
  
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    console.log(process)
    //console.log(process.env.FRONTEND_URL);
  
    // We here need to send an email to the user with the token
    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href="https://${resetPasswordUrl}" target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;
  
    console.log(resetPasswordUrl);
  
    try {
      await sendEmail(email, subject, message);
  
      // If email sent successfully send the success response
      const data = {
        date:new Date().getFullYear(),
        errors:true,
        errormsg:"Forget Password mail sent to your mail ",
    }

  res.render("forget.ejs",data);
     
    } catch (error) {
      // If some error happened we need to clear the forgotPassword* fields in our DB
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
  
      await user.save();
      const data = {
        date:new Date().getFullYear(),
        errors:true,
        errormsg:"Some error occured ! try again",
    }

  res.render("forget.ejs",data);
         
    }
  });

  export default forgetPassword;