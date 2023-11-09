import User from "./userSchema.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
const createUser = async(req,res)=>{
    console.log(req.body);
    const {name,email,password,mobile,role}  = req.body;
    console.log(mobile);

     // checking if all the fields are avilable or not
            if(!name || !email || !password || !mobile || !role){
                const data = {
                    date:new Date().getFullYear(),
                    notallfield:true,
                    regok:false,
                    errors:true,
                    errormsg:"All fields required ",
                }

            res.render("AddbyAdmin.ejs",data);
            }
        try{
    const userExists = await User.findOne({ email });
    console.log(userExists);

      if(userExists){
         console.log("email already exists ");
      }

      console.log("here");
      
      // create new user document in the user collection 
      var user = await User.create({   // creatiing a document inside the User collection 
        name,
        email,
        password,
        mobile,
        role,
       
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
    //user.password = undefined;

     console.log("new user successfully created  to the database ");
  
      try{
        user = await User.find({}).select('-password'); // select  everything dont display any information about particular computer
      }
      catch(e){
        console.log(e);
      }
      
      console.log("hine tak holo create"); 
     res.render("RegisteredUser.ejs",{
         posts:user, // key is the variable in the ejs file jaske endar value pas hoga 
         date: new Date().getFullYear(),
         errors:false,
         
         
     });
}

    catch(e){
        const data = {
            date:new Date().getFullYear(),
            notallfield:true,
            regok:false,
            errors:true,
            errormsg:e.message,
        }

       

        res.render("AddbyAdmin.ejs",data);
    }
}


const UpdateUserbyAdmin = async(req,res,next)=>{
    var user;
    try{
        const {id} = req.params;
       user = await User.findByIdAndUpdate(
          id,
          {
            $set:req.body
          },
          {
            runValidators:true
          }
        )
      
          if(!User){
            console.log("Sorry the computer with the given id doesnt exist ")
          }
           user = await User.find({}).select('-password');
          res.render("RegisteredUser.ejs",{
            posts:user, // key is the variable in the ejs file jaske endar value pas hoga 
            date: new Date().getFullYear(),
            errors:true,
            errormsg:"successfully updated the user"
            
        });
      
        }

        catch(e){
            console.log(e);
        }
}

const deleteUser = asyncHandler(async (req, res, next) => {
    // Grabbing the courseId and lectureId from req.query
    const { id } = req.params;
  
    console.log(id);
  
    // Checking if both courseId and lectureId are present
    if (!id) {
      console.log("User id required");
    }
     var deleted;
    const deleteUser = User.findById(id).then(result=>{
        console.log(result);
      deleted = result.name;
      console.log("successfull");
    })

    .catch(err=>{
      console.log("some errot ");
    });
    console.log(deleteUser);
    console.log(deleteUser.title);
   
    const re = await User.deleteOne({_id:id});
    console.log(re);
    
   
    const users = await User.find({}).select('-password');
    res.render("RegisteredUser.ejs",{
      posts:users, // key is the variable in the ejs file jaske endar value pas hoga 
      date: new Date().getFullYear(),
      errors:true,
      errormsg:"successfully deleted the user with title as"+deleted,
      
  });
  }
);

export default createUser;
export {deleteUser,UpdateUserbyAdmin};