import Computer from "./computerSchema.js";
const getAllComputers = async function(req,res,next){
    try{
    const computers = await Computer.find({}).select('-computers'); // select  everything dont display any information about particular computer 
    res.render("getComputer.ejs",{
        posts:computers, // key is the variable in the ejs file jaske endar value pas hoga 
        date: new Date().getFullYear(),
        errors:false,
        added:false,
        
    });

   
   
}
catch(e){
console.log(e);
}
}


const getComputerById = async function(req,res,next){
try{
    const {id} = req.params;
    const computer = await Computer.findById(id);
    res.status(200).json({
        success:true,
        message:'Computer with the id given fetched successfully ',
        computers:computer.computers,
    }) 
}
catch(e){

}
}

export {getAllComputers, getComputerById};