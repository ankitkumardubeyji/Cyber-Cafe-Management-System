
import mongoose from "mongoose";

mongoose.set('strictQuery',false); //  // ignoring the query that asks you to save the properties that doesnt exists in the database

const connectionToDB= async()=>{
    try{
    const {connection } = await mongoose.connect(  // database connection asynchronously work krta hai ie , jab call successfull ho jyega
    // db connect ho jyega uske baad response ayega 
        `mongodb://127.0.0.1:27017/ccms`
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

