
import mongoose from "mongoose";

mongoose.set('strictQuery',false); //  // ignoring the query that asks you to save the properties that doesnt exists in the database

const connectionToDB= async()=>{
    try{
    const {connection } = await mongoose.connect(  // database connection asynchronously work krta hai ie , jab call successfull ho jyega
    // db connect ho jyega uske baad response ayega 
       `mongodb+srv://ankitdubey1570:SZmY4RYB2Hr5QKPl@cluster0.85nrtrt.mongodb.net/?retryWrites=true&w=majority`,{
           useNewUrlParser:true,
           useCreateIndex:true,
           useUnifiedTopology:true,
            useNewUrlParser: true,
           useFindAndModify:false,
           

       }


    );

    if(connection){
        console.log(`Connected successfully to the database :${connection.host}`);
    }

}
catch(e){
    console.log(e);
    process.exit(1);
}
}



export default connectionToDB;

