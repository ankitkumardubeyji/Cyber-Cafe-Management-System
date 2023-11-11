import User from "./userSchema.js";

const register = async(req,res)=>{
    console.log(req.body);
    const {name,email,password,mobile,role}  = req.body;
 //  const  image = new Date().toString().substr(8,13).split(" ").join("");
 console.log(req.file.filename);
 const image = req.file.filename;

    
   

     // checking if all the fields are avilable or not
            if(!name || !email || !password || !mobile || !role){
                const data = {
                    date:new Date().getFullYear(),
                    notallfield:true,
                    regok:false,
                    errors:true,
                    errormsg:"All fields required ",
                }

            res.render("index.ejs",data);
            }
        try{
    const userExists = await User.findOne({ email });
    console.log(userExists);

      if(userExists){
        const data = {
            date:new Date().getFullYear(),
            notallfield:true,
            regok:false,
            errors:true,
            err:"SORRY!",
            errormsg:"Sorry this email is already registered!",
            src:"https://tse4.mm.bing.net/th?id=OIP.adi_Lh7frVZg-SaO8gwQBwHaHa&pid=Api&P=0&h=180",
        }

       

        res.render("index.ejs",data);
      }

      console.log("here");
      
      // create new user document in the user collection 
      const user = await User.create({   // creatiing a document inside the User collection 
        name,
        email,
        password,
        mobile,
        role,
        image,
      });

      console.log("here");
      
     await user.save();
     const token = await user.generateJWTToken();

     const cookieOptions = {
        maxAge : 7 *24 *60 *60 *1000, // 7 days
        httpOnly:true,
        secure:true
    }

    res.cookie('token',token,cookieOptions);
    user.password = undefined;

     console.log("new user successfully registered to the database ");
  
      
     const c = await User.find().countDocuments();
     console.log(c); 

     User.find().then((Items,err)=>{
         console.log(Items);
     });

     const au = await User.find({active:true}).countDocuments();
     console.log(au);
     const data = {
       date:new Date().getFullYear(),
       username:name,
       leave:false,
       register:true,
       book:false,
       logout:false,
       login:false,
       registeredUser:c,
       activeUser:au,
       errormsg:"Registered Successfully!",
       err:"Thank You!",
       src:"https://tse1.mm.bing.net/th?id=OIP.1jkmnxXg6sT_ifiehDLgngHaHa&pid=Api&rs=1&c=1&qlt=95&w=123&h=123"
       
   }
   
    
    if(role=='ADMIN'){
        res.render("AdminHomePage.ejs",data);
    }
    else{

     res.render("UserHomePage.ejs",data);
    }
}

    catch(e){
        const data = {
            date:new Date().getFullYear(),
            notallfield:true,
            regok:false,
            errors:true,
            errormsg:e.message,
        }

       

        res.render("index.ejs",data);
    }
}



export default register;
