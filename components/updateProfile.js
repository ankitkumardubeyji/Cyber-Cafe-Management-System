import User from "./userSchema.js";
const updateUser = async(req,res,next) =>{
  const {name,email,mobile,role} = req.body;
  const userId = req.user.id;
  const user = await User.findById(userId);
  
  
  
  if(!user){
     console.log("user doesnt exist");
  }
  
  
    user.name = name;
    user.email = email;
    user.mobile = mobile;
    user.role = role;
    user.image = req.file.filename,
  
  // write the code for updating the profile picture
  console.log("here aa gya re");
  console.log(user);
  await user.save();
  
  const data = {
    name:user.name,
    email:user.email,
    mobile:user.mobile,
    role:user.role,
    date: new Date().getFullYear(),
    image:user.image,
}
res.render("about.ejs",data);



  
  }

  export default updateUser;