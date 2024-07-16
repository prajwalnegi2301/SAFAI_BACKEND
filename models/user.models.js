import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
     
    },
    gender:{
        type:String,
        enum:["Male","Female","Other"],
    },
    phone:{
        type:String,
       
        minLength:[10, "Phone Number must be 10 digit"],
    },
    email:{
        type:String,
        validate:[validator.isEmail, "Enter a valide email"],
    },
    address:{
        type:String,
    },
    password:{
        type:String,
        minLength:[8,"Password is too short"],
    },
    token:{
        type:String,
    },
    avatar:{
        public_id:String,
        url:String,
    },
    document: {
        type: String,
        enum: ["License", "AadharCard", "PanCard", "VoterId"],
      },
    docAvatar:{
        public_id:String,
        url:String,
    },
    role:{
        type:String,
        enum:["Admin","User","Worker"],
    },
    occupation: {
        type: String,
        enum: [
          "Barber",
          "Plumber",
          "Electrician",
          "Helper",
          "BabySitter",
          "House Work",
          "Driver",
          "Mechanic",
          "MobileRepairing",
          "Carpenter",
          "SalesMan",
          "Others",
        ],
      },
      salary: {
        type: String,
      },
      available: {
        type: String,
        enum: ["Available", "NotAvailable"],
      },
      desc:{
        type:String,
      },

},
);

const user = mongoose.model("User", userSchema);
export default user;