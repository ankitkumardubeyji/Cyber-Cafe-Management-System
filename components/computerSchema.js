import {model,Schema} from "mongoose";

const computerSchema = new Schema({
    title:{     // company name 
        type:String,
        required:[true,'Title is required'],
        trim:true,

    },
    description:{
        type:String,
        required:[true,'Title is required'],
        trim:true,
    },
    category:{  // processor 
        type:String,
        required:[true,'Category is required']
        },

    computers:[  // to store information about all the computers avilable of that company
        {
            title:String,   // informartin about a particular computer of that company
            description:String,
            lecture:{
                IP_Address:{  // ip address of the particular computer of that company 
                    type:String,
                },
                current_User:{
                    type:String,
                }
            }
        }
    ],
    numberofComputers:{
        type:Number,
    },
    freeComputers:{
        type:Number,
    },
    createdBy:{     // the admin who has add the computer 
        type:String,
    }
},{
    timestamps:true,
})

const Computer = new model('computer',computerSchema); // creating a collection computer , to store the details of all the computers avilable
export default Computer;