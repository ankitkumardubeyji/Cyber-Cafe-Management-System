import {Schema,model} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { time } from "console";

// creating the userschema : user can login ,register , logout , see profile , update profile 
const userSchema = new Schema(
    {
      name: {
        type: String,
        required: [true, 'Name is required'], // message popped if name not entered 
        minlength: [5, 'Name must be at least 5 characters'],
        lowercase: true,  // name always gets stored in the lowercase in the database 
        trim: true, // Removes unnecessary spaces
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // email requires to be unique 
        trim:true,
        lowercase: true,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please fill in a valid email address',
        ], // Matches email against regex for validating the email
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false, // Will not select password upon looking up a document , will notgive by default the password of the user when asked , when
        // asked explicitly given.
      },
      mobile:{
        type:String,
        required: [true, 'Password is required'],
      },
  
      subscription: {
        id: String,
        status: String,
      },
      // will be using third party Cloudinary for it
      active: {
        type:Boolean,
        default: false,
      },
      end:{
        type:String,
      },

      date:{
        type:String,
      },
      computer:{
        type:String,
      },
      image: {
        type:String,
      },

    
  
  // depending the role hum permissions assign krenge 
      role: {
        type: String,
        enum: ['USER', 'ADMIN'],  // to decide whether the entered user is admin user or the studnent
         default: 'USER', 
      },

      
      forgotPasswordToken: String, // token will be sent to the user during the password with the token created sent to user sand stored in databse 
      forgotPasswordExpiry: Date,  // token stored in the database will be valid for the limited amount of ttype 
      activityexpiry:Date,
  
    },

    {
      timestamps: true,    // when created by default gets added 
    }
  );

  // Hashes password  while registering a new user before saving to the database ,  a custom middleware when ever the user information is upadated and save 
userSchema.pre('save', async function (next) {
    // If password is not modified then do not hash it
    if (!this.isModified('password')) return next();
  
    this.password = await bcrypt.hash(this.password, 10);
  });



  userSchema.methods = {
    // method which will help us compare plain password with hashed password and returns true or false
    comparePassword: async function (plainPassword) {
      return await bcrypt.compare(plainPassword, this.password);
    },
  
    // Will generate a JWT token with user id as payload 
    // the jwt token consists of the threee parts 
    generateJWTToken: async function () {
      return await jwt.sign(
        { id: this._id, role: this.role, email:this.email }, // data
        "aaja na ferrari mae",  // the secret token , yhi secret token se validate hoga ki , token valid token hai ki 
        {
          expiresIn: '24h',  // setting the token ki expiry time 
        }
      );
    },
  
    // This will generate a token for password reset
    generatePasswordResetToken: async function () {
      // creating a random token using node's built-in crypto module
      const resetToken = crypto.randomBytes(20).toString('hex');
  
      // Again using crypto module to hash the generated resetToken with sha256 algorithm and storing it in database
      this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
  
      // Adding forgot password expiry to 15 minutes
      this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
  
      return resetToken;
    },
  };




  const User = model('User', userSchema);  // creating a User collection in the database with the userSchema schema 
  export default User;