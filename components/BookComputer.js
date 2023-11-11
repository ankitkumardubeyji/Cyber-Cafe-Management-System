import Computer from "./computerSchema.js";
import User from "./userSchema.js";

var endtime=0;
var  user;

const BookComputer = async(req,res)=>{
    const {option_selected,email,minutes} = req.body;
    console.log(email);
    user = await User.findOne({email});
   console.log(user.active);
   user.active=true;
   await user.save();
   
   var min = parseInt(minutes);
   const date = new Date();
endtime = new Date(date.getTime()+(min*60000)).toLocaleTimeString().substr(0, 7);
  user.end=endtime;
    console.log(endtime);
    console.log(user.end);
    console.log(min);
  user.date = new Date().toLocaleDateString();
  
  await user.save();

   const computer = await Computer.findById(option_selected);
   console.log(computer);
   console.log(computer.freeComputers);
  

    if(computer.freeComputers>0){
        /*
        res.render("Payment.ejs",{
            option_selected:option_selected,
            email:email,
            minutes:minutes,
            amount:minutes*3+"Rs",
            errors:false,
            date:new Date().getFullYear(),
            order_id:user._id,
        });
        */
        user.computer = computer._id;
        await user.save();
        computer.freeComputers = computer.freeComputers-1;
        computer.save();
        console.log("succesfully assigned the computer");
        const data = {
            date:new Date().getFullYear(),
            username:"ankit",
            leave:false,
        register:false,
        book:true,
        logout:false,
        login:false,
            errormsg:"You have successfully bokked the computer",
            err:"Thank You!",
            src:"https://tse1.mm.bing.net/th?id=OIP.1jkmnxXg6sT_ifiehDLgngHaHa&pid=Api&rs=1&c=1&qlt=95&w=123&h=123",
            at:min,
            name:computer.title,
            upto:endtime,
            id:user._id,

        }
        console.log("here");
        res.render("UserHomePage.ejs",data);
    }
    else{
        console.log("haat bsdk computer hi chalayega");
    }
}

export default BookComputer;

const leaveComputer = async(req,res)=>{
    const { id } = req.params;
  
    console.log(id);
  
    // Checking if both courseId and lectureId are present
    if (!id) {
      console.log("User id required");
    }
   
    const deleteUser = await User.findById(id);
    console.log(deleteUser);
    deleteUser.endtime="";
    deleteUser.active=false;
    console.log(deleteUser.computer);
    console.log(Computer);
    var computeri =  await Computer.findById(deleteUser.computer);
    console.log(computeri);
    computeri.freeComputers++;
    await computeri.save();
    deleteUser.computer="";

  

    res.render('UserHomePage.ejs', {
        date:new Date().getFullYear(),
        username:deleteUser.name,
        leave:true,
        register:false,
        book:false,
        logout:false,
        login:false,
        err:"Thank You Join Soon!",
        errormsg:'You have successfully left computer!'


       
        
     } )
};

export {leaveComputer};

