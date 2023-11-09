import User from "./userSchema.js";

const login = async(req,res)=>{
    const {name,email,password}  = req.body;
    console.log(req.body);
     // checking if all the fields are avilable or not
            if(!name || !email || !password ){
                const data = {
                    date:new Date().getFullYear(),
                    errors:true,
                    errormsg:"All fields required ",
                }

            res.render("loginPage.ejs",data);
            }

            var user;
            try{
             user = await User.findOne({
                email
              }).select('+password'); // selecting the explicity the user ke password as by default its selection in  thesuer,odelhas been setr as false 
              
       
              if(!user || !user.comparePassword(password)){
                const data = {
                    date:new Date().getFullYear(),
                    errors:true,
                    errormsg:"Enter the correct password",
                }
                res.render("loginPage.ejs",data);

              }

            
         

              const token = await user.generateJWTToken();
              const cookieOptions = {
                maxAge : 7 *24 *60 *60 *1000, // 7 days
                httpOnly:true,
                secure:true
            }
              
              res.cookie('token',token,cookieOptions);
              console.log(res.cookie);
             
            
              const c = await User.find().countDocuments();
              console.log(c); 
/*
              User.find().then((Items,err)=>{
                  console.log(Items);
              });
*/
              const au = await User.find({active:true}).countDocuments();
              console.log(au);
              console.log(user);
              console.log(user.active);

              if(user.active==true){
              var time1= new Date().toLocaleTimeString().substr(0, 7) ;
              var time2= user.end;

              var t1 = time1.split(":");
              var t2 = time2.split(":");

              function toNumber(value){
                return Number(value);
              }

              var num1 = t1.map(toNumber);
              var num2 = t2.map(toNumber);
              console.log(num1[0]+" "+num2[0]);
              console.log(num1[1]+" "+num2[1]);
              console.log(num1[2]+" "+num2[2]);

              if(num1[0]<=num2[0] && num1[1] <= num2[1]){
                console.log("there");
             
                console.log(num2[1]-num1[1]);
              console.log("hine");
          
                const data = {
                  date:new Date().getFullYear(),
                  username:user.name,
                  leave:false,
                  register:false,
                 book:true,
                 logout:false,
                 login:true,
                 id:user._id,
                 err:"Welcome!",
                 errormsg:"Your session is undergoing "+user.computer+"",
                  at:num2[1]-num1[1],
                  name:user.computer,
                  upto:user.end,
      
              }
              console.log("here hine");
              res.render("UserHomePage.ejs",data);
              }
              else{
                console.log("else part");
                user.active=false;
                user.computer="";
                try{
                await user.save();
                }
                catch(e){
                  
                  console.log(e);
                }
               
                const data = {
                  date:new Date().getFullYear(),
                  username:name,
                  leave:true,
                  register:false,
                 book:false,
                 logout:false,
                 login:true,
                 err:"Welcome ",
                 errormsg:'Logged in Successfully',
                  registeredUser:c,
                  activeUser:au,
                  
              } 
              
              if(user.role=='ADMIN'){
                
                res.render("AdminHomePage.ejs",data);
              }
              else{
                res.render("UserHomePage.ejs",data);
              }


              }
              
              
            }

            else{

          // case if the user.active is false            
              const data = {
                date:new Date().getFullYear(),
                username:name,
                leave:false,
                register:false,
               book:false,
               logout:false,
               login:true,
               err:"Welcome!",
               errormsg:"logged in Successfully",
                registeredUser:c,
                activeUser:au,
                
            } 
            
            if(user.role=='ADMIN'){
              
              res.render("AdminHomePage.ejs",data);
            }
            else{
              res.render("UserHomePage.ejs",data);
            }

            }
          }
            catch(e){
                const data = {
                    date:new Date().getFullYear(),
                    errors:true,
                    errormsg:"No such Account Registered ",
                }
                res.render("loginPage.ejs",data);
            }

}

export default login;