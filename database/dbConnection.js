import mongoose from "mongoose";

export const dbConnection =()=>{
    mongoose.connect(process.env.MONGO,{
        dbName: "SAFAI_MERN_STACK",
    })
    .then(()=>{
        console.log("connected to database")
    })
    .catch((err)=>{
        console.log(`some error occured: ${err}`);
    })
};