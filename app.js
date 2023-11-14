// library imports 
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connectionToDB from "./components/databaseConnection.js"; 
import User from "./components/userSchema.js";
import sendEmail from "./components/sendEmail.js";
import asyncHandler from "./middlewares/asyncHandler.middleware.js";
import { config } from "dotenv";
import crypto from "crypto";
import UserState from "./components/UserState.js";
import multer from "multer";
import path from "path";

// components

import {Schema,model} from "mongoose";
import register from "./components/UserRegistration.js";
import login from "./components/UserLogin.js";
import LogOut from "./components/UserLogout.js";
import isLoggedin from "./middlewares/isLoggedIn.js";
import cookieParser from "cookie-parser";
import getProfile from "./components/UserProfile.js";
import { ResetPassword } from "./components/ResetPassword.js";
import forgetPassword from "./components/ForgetPassword.js";
import updateUser from "./components/updateProfile.js";
import { getAllComputers } from "./components/AvilableComputers.js";
import { createComputer,updateComputer,deleteComputer } from "./components/CreateComputer.js";
import Computer from "./components/computerSchema.js";
import BookComputer, { leaveComputer } from "./components/BookComputer.js";

import createUser, { UpdateUserbyAdmin, deleteUser } from "./components/CreateUserbyAdmin.js";
import { allowedNodeEnvironmentFlags } from "process";



const app = express();
config(); 
//console.log(process.env.FRONTEND_URL);
// different middlewares
app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());


// estabilishing the database connections
// connection to the database
connectionToDB();


//---------------------- Different Routes ---------------------------------------


// 1. the first page that will be visible
app.get("/",(req,res)=>{
    
    const data = {
        date:new Date().getFullYear(),
        errors:false,
    }
        res.render("index.ejs",data);
    });

    app.get("/register",(req,res)=>{
    
        const data = {
            date:new Date().getFullYear(),
            errors:false,
        }
            res.render("index.ejs",data);
        });
app.get('/contact',(req,res)=>{
  res.render("contact.ejs",{
    date:new Date().getFullYear(),
  });
})


app.get("/login",(req,res)=>{
    const data = {
        date:new Date().getFullYear(),
        errors:false,
    }
        res.render("loginPage.ejs",data);
})  

app.get('/forget',(req,res)=>{
    const data = {
        date:new Date().getFullYear(),
        errors:false,
    }
        res.render("forget.ejs",data);
});
app.get("/userhome",isLoggedin,(req,res)=>{
const data = {
  date:new Date().getFullYear(),
  username:req.user.name,
  errors:false,
  register:false,
  logout:false,
  login:false,
  book:false,
  leave:false,
}

res.render("UserHomePage.ejs",data);
});

app.get('/AdminHome',isLoggedin,async(req,res)=>{
  const c = await User.find().countDocuments();
  const au = await User.find({active:true}).countDocuments();
  const data = {
    date:new Date().getFullYear(),
    username:req.user.name,
    errors:false,
    registeredUser:c,
    activeUser:au,
    login:false,

    
} 
 
  res.render("AdminHomePage.ejs",data);
})



  app.get("/reset-password/:resetToken",  asyncHandler(async (req, res, next) => {
    const { resetToken } = req.params;
    const data = {
      date:new Date().getFullYear(),
      errors:true,
      errormsg:"Please reenter your details ",
      params:resetToken,
  }

res.render("ResetPassword.ejs",data);
  
  }));

  
  app.get("/update",isLoggedin,async(req,res)=>{
    console.log("here");
    const userId = req.user.id;
    console.log("there");
    const user = await User.findById(userId);
    console.log(user);

    const data = {
      name:user.name,
      email:user.email,
      mobile:user.mobile,
      role:user.role,
      date: new Date().getFullYear(),
      errors:false,
  }
  res.render("Update.ejs",data);
  })


 



// ---------------------------------------------------------------------------------------------------------------------------------

const Storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public');
  },
  filename:(req,file,cb)=>{
    console.log(file);
    cb(null,new Date().toString().substr(8,13).split(" ").join("").split(":").join("")+path.extname(file.originalname));
  }
})
const upload = multer({storage:Storage});


app.post('/update',isLoggedin,upload.single('image'),updateUser);

// 2. User Registration route
app.post("/UserRegister",upload.single('image'),register);
app.post("/UserLogin",login);
app.get("/logOut",LogOut );
app.get("/me",isLoggedin,getProfile);
app.post('/forget-password',forgetPassword);
app.post("/reset-password/:resetToken",ResetPassword);
//app.post("/update", isLoggedin, updateUser);

//app.get('/payment',PaymentRenderPage);
//app.post('/createOrder',createOrder);


//---------------- feedback
const itemsSchema = new mongoose.Schema({
  title:String,
  body:String,
  time:String,
});

const Item = mongoose.model("item",itemsSchema);

// adding new document item1 inside the collection itemSchema 
const Item1 = new Item({
  title:"dubey",
  body:"chal mere ghar",
  time:new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString().substr(0,7),
  });
  
  
  
  
  const defaulItems = [Item1]

  app.get('/feedback',(req,res)=>{
    Item.find().then((Items,err)=>{
        if(err){
            console.log("some error occured ");
        }
        // inserting the default items when the database is empty 
        else if(Items.length==0){
            Item.insertMany(defaulItems).then(()=>{
                console.log("successfully inserted the documents");
                
            })
            .catch((err)=>{
                console.log("sorry cant be inserted ");
                console.log(err);
            })
            res.redirect("/");
        }
        else{
            res.render("Feedback.ejs",{
                homeContent:"I love you",
                posts:Items, // key is the variable in the ejs file jaske endar value pas hoga 
                date: new Date().getFullYear(),
                errors:false,
                compose:false,
                
            });
        }
    })
   
     // printing all that has been stored inside the post array
})



app.get("/compose",(req,res)=>{
  const data = {
    date:new Date().getFullYear(),
  }
  res.render("Compose.ejs",data);
})

app.post("/deletefd",async(req,res)=>{
  console.log(req.body.checkBox);

      const re = await Item.deleteOne({_id:req.body.checkBox});
res.redirect("/feedback");
});

app.post("/submit",async(req,res)=>{
  // making a new document of the collection Item
  const newItem = new  Item({
      title:req.body["postTitle"],
      body:req.body.postBody,
      time:new Date().toLocaleDateString()+" "+new Date().toLocaleTimeString().substr(0,7),
  })    
  // saving the new document inside the collection 
  newItem.save();        
  res.render("Feedback.ejs",{
    homeContent:"I love you",
    posts: await Item.find({}), // key is the variable in the ejs file jaske endar value pas hoga 
    date: new Date().getFullYear(),
    errors:false,
    err:'Thank You for your valuable feedback',
    errormsg:"feedback successfully submitted",
    compose:true,
    src:"https://tse1.mm.bing.net/th?id=OIP.1jkmnxXg6sT_ifiehDLgngHaHa&pid=Api&rs=1&c=1&qlt=95&w=123&h=123",
    
});               
  })

// -------------------------------------------------------------------------------------------------------------------------

app.get('/computers',getAllComputers);

app.post('/createComputer',createComputer);

app.get('/update/:id',(req,res)=>{

 
  const { id } = req.params;

  console.log("hine aaya tha re");
  console.log(id);
   const data={
    errors:false,
    date:new Date().getFullYear(),
    params:id,
   
   }
  res.render("UpdateComputer.ejs",data);
})

app.post('/update/:id',updateComputer);



app.get('/deleteComputers/:id',deleteComputer);

app.get('/deleteUsers/:id',deleteUser);
app.get('/updateUsers/:id',(req,res)=>{

 
  const { id } = req.params;

  console.log("hine aaya tha re");
  console.log(id);
   const data={
    errors:false,
    date:new Date().getFullYear(),
    params:id,
   
   }
  res.render("UpdateUserbyAdmin.ejs",data);
})
app.post('/updateUsers/:id',UpdateUserbyAdmin);



app.get('/create',(req,res)=>{
  const data={
    errors:false,
    date:new Date().getFullYear(),
   
  }
  res.render("CreateComputer.ejs",data);
})

app.get('/users',UserState);

app.get('/bookComputer',async(req,res)=>{
  const computers = await Computer.find({}).select('-computers'); 
  const data={
    errors:false,
    date:new Date().getFullYear(),
    posts:computers,
   
  }
  res.render("BookComputer.ejs",data);
})

app.post('/bookComputer',BookComputer);


app.get('/regusers',async(req,res)=>{
  const user = await User.find({}).select('-password'); // select  everything dont display any information about particular computer 
  res.render("RegisteredUser.ejs",{
      posts:user, // key is the variable in the ejs file jaske endar value pas hoga 
      date: new Date().getFullYear(),
      errors:false,
      
      
  })});
    app.get('/active',async(req,res)=>{
  const user = await User.find({}).select('-password'); // select  everything dont display any information about particular computer 
  const comp = await Computer.find({title:user.computer});
  res.render("ActiveUser.ejs",{
      posts:user, // key is the variable in the ejs file jaske endar value pas hoga 
      date: new Date().getFullYear(),
      errors:false,
      id:comp._id
      
      
  });

  app.get('/createUser',(req,res)=>{
    console.log("here in ");
    res.render("AddbyAdmin.ejs",{
      posts:user, // key is the variable in the ejs file jaske endar value pas hoga 
      date: new Date().getFullYear(),
      errors:false,
      
      
  });
  })
  app.post('/createUser',createUser);



});

app.post("/leave/:id",leaveComputer);


// server listening

const port = 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
