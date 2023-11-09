import User from "./userSchema.js";
const UserState = async(req,res)=>{
 const count = User.find().countDocuments();
 const data = {
    date:new Date().getFullYear(),
    username:ankit,
    registeredUser:count,
} 
  res.render("AdminHomePage.ejs",data);
}

export default UserState;