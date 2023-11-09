// middleware that will be verifying user logged in or not 

import jwt from 'jsonwebtoken';

// cookie mai token ke andar currently logged in user ke sare information stored hai waha se hum extract kr skte hai 
const isLoggedin = async (req,res,next)=>{
try{
   console.log(req.cookies);
 const {token} = req.cookies;
 console.log(token);
 const userDetails = await jwt.verify(token,"aaja na ferrari mae"); // async wait kb lagate 

 req.user = userDetails;
 console.log(req.user);

 next();
}
 catch(e){
   const data = {
      date:new Date().getFullYear(),
      errors:true,
      errormsg:"User Not Authenticated",
  }
  
   res.render("registerPage.ejs",data);
 }

 

}

export default isLoggedin;