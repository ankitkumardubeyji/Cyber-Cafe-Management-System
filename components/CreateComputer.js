import Computer from "./computerSchema.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { ObjectId } from "mongodb";
const createComputer = async(req,res,next)=>{
    const {title,description,category,numberofComputers,createdBy} = req.body;
    if(!title || !description || !category || !createdBy || !numberofComputers){
        console.log("all field required");
    }
    const freeComputers = numberofComputers;
  
    const computer = await Computer.create({
      title,
      description,
      category,
      createdBy,
      numberofComputers,
      freeComputers,
    })
  
    if(!computer){
      console.log("the computer Couldnt be added ");
    }
  
    // handle the uploading of the image file 
  
  
    await computer.save();

    const computers = await Computer.find({}).select('-computers');
    res.render("getComputer.ejs",{
        posts:computers, // key is the variable in the ejs file jaske endar value pas hoga 
        date: new Date().getFullYear(),
        added:true,
        err:"Successfully Added",
        errormsg:"successfully added the computer "+computer.title+" of id :"+computer._id,
        src:"https://tse1.mm.bing.net/th?id=OIP.1jkmnxXg6sT_ifiehDLgngHaHa&pid=Api&rs=1&c=1&qlt=95&w=123&h=123",
        
    });
  
  
  
  }



const updateComputer = async(req,res,next)=>{
    try{
        const {id} = req.params;
        const computer = await Computer.findByIdAndUpdate(
          id,
          {
            $set:req.body
          },
          {
            runValidators:true
          }
        )
      
          if(!computer){
            console.log("Sorry the computer with the given id doesnt exist ")
          }
          const computers = await Computer.find({}).select('-computers');
          res.render("getComputer.ejs",{
            posts:computers, // key is the variable in the ejs file jaske endar value pas hoga 
            date: new Date().getFullYear(),
            errors:true,
            errormsg:"successfully updated the computer",
            added:false,
            
        });
      
        }

        catch(e){
            console.log(e);
        }
}

const deleteComputer = asyncHandler(async (req, res, next) => {
    // Grabbing the courseId and lectureId from req.query
    const { id } = req.params;
  
    console.log(id);
  
    // Checking if both courseId and lectureId are present
    if (!id) {
      console.log("computer id required");
    }
     var deleted;
    const deleteComputer = Computer.findById(id).then(result=>{
      deleted = result.title;
      console.log("successfull");
    })

    .catch(err=>{
      console.log("some errot ");
    });
    console.log(deleteComputer);
    console.log(deleteComputer.title);
   
    const re = await Computer.deleteOne({_id:id});
    
   
    const computers = await Computer.find({}).select('-computers');
    res.render("getComputer.ejs",{
      posts:computers, // key is the variable in the ejs file jaske endar value pas hoga 
      date: new Date().getFullYear(),
      errors:true,
        added:false,
      errormsg:"successfully deleted the computer with title as"+deleted,
      
  });
  }
);


export {createComputer,updateComputer,deleteComputer};
