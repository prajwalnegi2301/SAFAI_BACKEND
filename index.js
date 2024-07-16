import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnection } from './database/dbConnection.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cloudinary from "cloudinary";
import { errorMiddleware } from './utils/errorMiddleware.js'
import userRouter from './routes/user.routes.js';
import ContactUsRouter from './routes/contactUs.routes.js';
import FeedBackRouter from './routes/feedback.routes.js';
import Visitor from './models/visitor.models.js'
import { generateUniqueId } from './middlewares/generateUniqueId.js';
import asyncErrorHandler from './utils/asyncErrorHandler.js';
import jwt from 'jsonwebtoken';
import visitor from './models/visitor.models.js';



const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

dotenv.config();
app.use(cors({
    origin: [process.env.FRONTEND_URL,process.env.DASHBOARD_URL],
    methods: ["GET","POST","PUT","DELETE"],
    credentials:true
}));

app.use(cookieParser());

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );


app.use(generateUniqueId);

// app.post('/api/v1/visitor/generatetoken', asyncErrorHandler(async (req, res, next) => {
//   const uniqueId = req.uniqueId;
//   let visitor = await Visitor.findById(uniqueId);

//   if (!visitor) {
//     // If user doesn't exist, create a new user with the unique ID
//     visitor = new Visitor({ _id: uniqueId });
//     await visitor.save();
//   }

//   const token = jwt.sign(
//     {
//       id: uniqueId, // Use the unique ID generated
//     },
//     process.env.JWT_SECRETTOKEN,
//     {
//       expiresIn: process.env.JWT_EXPIRESTOKEN,
//     }
//   );
//   visitor.token = token;
//   console.log(token);
//   await visitor.save();
//   ("token", token, {
//     expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//   })

//   res
//     .status(200)
    
//     .json({
//       success: true,
//       visitor,
//       token
//     });
// }));




// let token;


// app.post('/api/v1/visitor/generateToken', asyncErrorHandler(async (req, res, next) => {
  
//    token = req.uniqueId;
//    let visitor = await Visitor.findById(token);
//    if (!visitor) {
//     // If user doesn't exist, create a new user with the unique ID
//     visitor = new Visitor( {token: token} );
    
//     await visitor.save();
//     }
//     else{
//       visitor.token = token;
//     }
//     await visitor.save();
//   // await visitor.save();
//   // ("token", token, {
//   //   expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//   //   httpOnly: true,
//   // })

//   res
//     .status(200)
//     .json({
//       success: true,
//       visitor
//     });
// }));


// app.get('/api/v1/visitor/getToken', (req, res) => {
//   const token = visitor.token;
//   console.log(token);
// });



  // app.use(`/api/v1/user/${token}`,userRouter);
  app.use('/api/v1/user',userRouter);
  app.use('/api/v1/feedback',FeedBackRouter);
  app.use('/api/v1/contact',ContactUsRouter);




dbConnection();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log("server is running");
})