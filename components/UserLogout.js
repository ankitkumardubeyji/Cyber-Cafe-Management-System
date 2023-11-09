const LogOut = async(req,res)=>{
  // best tarika to logout cookie ko null kr do 
  res.cookie('token',null,{
    secure:true,
    maxAge:0,
    httpOnly:true
  });

  const data = {
    date:new Date().getFullYear(),
    errors:true,
    errormsg:"LoggedOut Successfully",
    err:"Thank You!",
    src:"https://tse1.mm.bing.net/th?id=OIP.1jkmnxXg6sT_ifiehDLgngHaHa&pid=Api&rs=1&c=1&qlt=95&w=123&h=123"
  }
  res.render("registerPage.ejs",data);

}

export default LogOut;