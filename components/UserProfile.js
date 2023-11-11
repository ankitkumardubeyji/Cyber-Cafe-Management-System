import User from "./userSchema.js";
  const getProfile = async(req,res,next)=>{
   
    try{
        console.log("here");
        const userId = req.user.id;
        console.log("there");
        const user = await User.findById(userId);
        console.log(user);
    
        console.log(user.name);
        const data = {
            name:user.name,
            email:user.email,
            mobile:user.mobile,
            role:user.role,
            date: new Date().getFullYear(),
            image:user.image,
        }
        res.render("About.ejs",data);

      }
      catch(e){
        const data={
            date:new Date().getFullYear(),
            errors:true,
            errormsg:"User Not Authenticated",
        }
        res.render("register.ejs",data);
      }


}

export default getProfile;
