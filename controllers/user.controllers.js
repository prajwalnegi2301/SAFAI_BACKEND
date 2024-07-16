import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import cloudinary from 'cloudinary'
import { generateUniqueId } from '../middlewares/generateUniqueId.js';
import Visitor from '../models/visitor.models.js'

// REGISTER USER->
export const registerUser = asyncErrorHandler(async (req, res,next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler(" Avatar Required!", 400));
  }
  const { docAvatar, avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  

  if (!allowedFormats.includes(docAvatar.mimetype) || (!allowedFormats.includes(avatar.mimetype))) {
    return next(new ErrorHandler("File Format Not Supported", 400));
  }
  const { name,  gender, address,  phone, email, password,role, document } = req.body;
  if (!name  || !gender || !address || !phone || !email || !role || !password || !document  ) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  
  const userExist = await User.findOne({ email });
  if (userExist) {
    return next(new ErrorHandler("User already exist", 400));
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary Error"
    );
    return next(
      new ErrorHandler("Failed To Upload Document To Cloudinary", 500)
    );
  }

  const cloudinaryResponse2 = await cloudinary.uploader.upload(
    avatar.tempFilePath
  );
  if (!cloudinaryResponse2 || cloudinaryResponse2.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse2.error || "Unknown Cloudinary Error"
    );
    return next(
      new ErrorHandler("Failed To Upload Avatar To Cloudinary", 500)
    );
  }

  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    gender,
    address,
    phone,
    role,
    document,
    password: hashedPassword,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    avatar: {
        public_id: cloudinaryResponse2.public_id,
        url: cloudinaryResponse2.secure_url,
      },
  });
 

  const tokenc = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRETC,
    {
      expiresIn: process.env.JWT_EXPIRESC,
    }
  );
  user.token = tokenc;

  await user.save();
  
  res
    .status(200)
    .cookie("tokenc", tokenc, {
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
      httpOnly: true,
  
    })
    .json({
      success: true,
      message: "User successfully created",
      user,
    });
});



// Register Admin

export const registerAdmin = asyncErrorHandler(async (req, res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler(" Avatar Required!", 400));
    }
    const { docAvatar, avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  
  
    if (!allowedFormats.includes(docAvatar.mimetype) || (!allowedFormats.includes(avatar.mimetype))) {
      return next(new ErrorHandler("File Format Not Supported", 400));
    }
    const { name, address, gender, phone, email, password,role, document } = req.body;
    if (!name  || !gender || !phone || !email || !role || !password || !document  ) {
      return next(new ErrorHandler("Fill the credentials", 400));
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new ErrorHandler("User already exist", 400));
    }
  
  
  
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary Error"
      );
      return next(
        new ErrorHandler("Failed To Upload Document To Cloudinary", 500)
      );
    }
  
    const cloudinaryResponse2 = await cloudinary.uploader.upload(
      avatar.tempFilePath
    );
    if (!cloudinaryResponse2 || cloudinaryResponse2.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse2.error || "Unknown Cloudinary Error"
      );
      return next(
        new ErrorHandler("Failed To Upload Avatar To Cloudinary", 500)
      );
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const admin = new User({
      name,
      email,
      gender,
      phone,
      role,
      document,
      password: hashedPassword,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      avatar: {
          public_id: cloudinaryResponse2.public_id,
          url: cloudinaryResponse2.secure_url,
        },
    });
   
  
    const tokena = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRETA,
      {
        expiresIn: process.env.JWT_EXPIRESA,
      }
    );
    admin.token = tokena;
    
    await admin.save();
    res
      .status(200)
      .cookie("tokena", tokena, {
        expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Admin successfully created",
        admin,
      });
  });


  // REGISTER Worker->
export const registerWorker = asyncErrorHandler(async (req, res,next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler(" Avatar Required!", 400));
    }
    const { docAvatar, avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/avif"];
  
  
    if (!allowedFormats.includes(docAvatar.mimetype) || (!allowedFormats.includes(avatar.mimetype))) {
      return next(new ErrorHandler("File Format Not Supported", 400));
    }
    const { name, address, gender, phone, email, password,role, document, occupation, salary, available } = req.body;
    if (!name || !address || !gender || !phone || !email || !role || !password || !document  || !occupation || !salary || !available ) {
      return next(new ErrorHandler("Fill the credentials", 400));
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new ErrorHandler("User already exist", 400));
    }
  
  
  
    const cloudinaryResponse = await cloudinary.uploader.upload(
      docAvatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary Error"
      );
      return next(
        new ErrorHandler("Failed To Upload Document To Cloudinary", 500)
      );
    }
  
    const cloudinaryResponse2 = await cloudinary.uploader.upload(
      avatar.tempFilePath
    );
    if (!cloudinaryResponse2 || cloudinaryResponse2.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse2.error || "Unknown Cloudinary Error"
      );
      return next(
        new ErrorHandler("Failed To Upload Avatar To Cloudinary", 500)
      );
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({
      name,
      email,
      address,
      gender,
      phone,
      role,
      available,
      occupation,
      salary,
      document,
      password: hashedPassword,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      avatar: {
          public_id: cloudinaryResponse2.public_id,
          url: cloudinaryResponse2.secure_url,
        },
    });
   
  
    const tokenw = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRETW,
      {
        expiresIn: process.env.JWT_EXPIRESW,
      }
    );
    user.token = tokenw;
    
    await user.save();
    res
      .status(200)
      .cookie("tokenw", tokenw, {
        expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
        httpOnly: true,
        secure: true,
      })
      .json({
        success: true,
        message: "Worker successfully created",
        user,
      });
  });
  
  



// LOGIN User->
export const loginUser = asyncErrorHandler(async (req, res, next) => {
  
  const { email, password, role } = req.body;
 
  if (!email || !password || !role) {
    return next(new ErrorHandler("Fill the credentials", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not registered", 400));
  }
  const passwordCompare =  bcrypt.compareSync(password, user.password);
  if (!passwordCompare) {
    return next(new ErrorHandler("Correct your password", 400));
  }

  const UserRole = user.role;
  if(UserRole!==role){
    return next(new ErrorHandler("User not associated with this role", 400));
  }

  const tokenc = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRETC,
    {
      expiresIn: process.env.JWT_EXPIRESC,
    }
  );
  user.token = tokenc;
  
  res
    .status(200)
    .cookie("tokenc", tokenc, {
      expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
      httpOnly:true
    })
    .json({
      success: true,
      message: "User successfully login",
      user
    });
});


// Login Admin->
export const loginAdmin = asyncErrorHandler(async (req, res, next) => {

    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new ErrorHandler("Fill the credentials", 400));
    }
    const admin = await User.findOne({ email });
    if (!admin) {
      return next(new ErrorHandler("Admin not registered", 400));
    }
    const passwordCompare =  bcrypt.compareSync(password, admin.password);
    if (!passwordCompare) {
      return next(new ErrorHandler("Correct your password", 400));
    }
  
    const UserRole = admin.role;
    if(UserRole!==role){
      return next(new ErrorHandler("User not associated with this role", 400));
    }
  
    const tokena = jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRETA,
      {
        expiresIn: process.env.JWT_EXPIRESA,
      }
    );
    admin.token = tokena;
    
    res
      .status(200)
      .cookie("tokena", tokena, {
        expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
        httpOnly:true
      })
      .json({
        success: true,
        message: "Admin successfully login",
        admin
      });
  });



  // Login Workers->

  export const loginWorker = asyncErrorHandler(async (req, res, next) => {
   
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return next(new ErrorHandler("Fill the credentials", 400));
    }
    const worker = await User.findOne({ email });
    if (!worker) {
      return next(new ErrorHandler("User not registered", 400));
    }
    const passwordCompare =  bcrypt.compareSync(password, worker.password);
    if (!passwordCompare) {
      return next(new ErrorHandler("Correct your password", 400));
    }
  
    const UserRole = worker.role;
    if(UserRole!==role){
      return next(new ErrorHandler("User not associated with this role", 400));
    }
  
    const tokenw = jwt.sign(
      {
        id: worker._id,
      },
      process.env.JWT_SECRETW,
      {
        expiresIn: process.env.JWT_EXPIRESW,
      }
    );
    worker.token = tokenw;
    
    res
      .status(200)
      .cookie("tokenw", tokenw, {
        expiresIn: new Date(Date.now()+process.env.COOKIE_EXPIRES *24*60*60*1000),
        httpOnly:true
      })
      .json({
        success: true,
        message: "Worker successfully login",
        worker
      });
  });




// LOGOUT CUSTOMER->
export const logOut = asyncErrorHandler(async (req, res, next) => {
  res
  .status(200)
  .cookie("tokenc", "",{
    expiresIn: new Date(Date.now()),
    httpOnly:true,
  })
  .json({
    message: "Logged Out",
    success:true,
  });
});

export const logOutAdmin = asyncErrorHandler(async (req, res, next) => {
  res
  .status(200)
  .cookie("tokena", "",{
    expiresIn: new Date(Date.now()),
    httpOnly:true,
  })
  .json({
    message: "Logged Out",
    success:true,
  });
});

export const logOutWorker = asyncErrorHandler(async (req, res, next) => {
  res
  .status(200)
  .cookie("tokenw", "",{
    expiresIn: new Date(Date.now()),
    httpOnly:true,
  })
  .json({
    message: "Logged Out",
    success:true,
  });
});


// DELETE User
export const deleteUser = asyncErrorHandler(async (req, res,next) => {
    const user = req.user;
    const userId = user._id;
    const findUser = await User.findById(userId);
    if(!findUser){
      return next(new ErrorHandler("Cannot find Customer",400))
    }
    await findUser.deleteOne()
    res
    .status(200)
    .json({message:"User deleted",success:true,findUser})
    
});

// Delete Worker
export const deleteWorker = asyncErrorHandler(async (req, res,next) => {
    const user = req.user;
    const userId = user._id;
    const findUser = await User.findById(userId);
    if(!findUser){
      return next(new ErrorHandler("Cannot find W",400))
    }
    await findUser.deleteOne()
    res
    .status(200)
    .json({message:"User deleted",success:true,findUser})
    
});

// Get Users->
export const getUsers = asyncErrorHandler(async (req, res,next) => {
    const user = req.user._id;
    const findUser = await User.find({role:"User"});
    if(!findUser){
      return next(new ErrorHandler("Cannot find Worker",400))
    }
    res
    .status(200)
    .json({message:"Users...",success:true,findUser});
  });



// Get All Workers
export const getWorkers = asyncErrorHandler(async (req, res,next) => {
  
  const workers = await User.find({role:"Worker"});
  if(!workers){
    return next(new ErrorHandler("Cannot find Worker",400))
  }
  res
  .status(200)
  .json({message:"Workers...",success:true,workers});
});



// Our Profile->
export const getParticularUser = asyncErrorHandler(async (req, res,next) => {
    
    const userId = req.user._id;
    const user = await User.findById(userId);
    if(!user){
        return next(new ErrorHandler("User not found",400))
    }
    res
    .status(200)
    .json({message:"user...",success:true,user});
});


// Worker Profile->
export const getParticularWorker = asyncErrorHandler(async (req, res,next) => {
  
    const {id} = req.params;
    const worker = await User.findById(id);
    if(!worker){
        return next(new ErrorHandler("User not found",400))
    }
    res
    .status(200)
    .json({message:"worker...",success:true,worker});
});


export const getParticularWorkerWithoutId = asyncErrorHandler(async (req, res,next) => {
    
  const userId = req.user._id;
  const worker = await User.findById(userId);
  if(!worker){
      return next(new ErrorHandler("Worker not found",400))
  }
  res
  .status(200)
  .json({message:"worker...",success:true,worker});
});


// Admin Profile->
export const getParticularAdmin = asyncErrorHandler(async (req, res,next) => {
    let admin = req.user;
    const userId = admin._id;
     admin = await User.findById(userId);
    if(!admin){
        return next(new ErrorHandler("User not found",400))
    }
    res
    .status(200)
    .json({message:"user...",success:true,admin});
});


// export const generateToken = asyncErrorHandler(async (req, res, next) => {
//   const uniqueId = req.uniqueId; // Assuming the unique ID comes from the request body
//   let user = await User.findById(uniqueId);

//   if (!user) {
//     // If user doesn't exist, create a new user with a unique ID
//     user = new User({ _id: uuidv4() });
//     await user.save();
//   }

//   const token = jwt.sign(
//     {
//       id: user._id, // Use the unique ID generated by uuidv4
//     },
//     process.env.JWT_SECRETTOKEN,
//     {
//       expiresIn: process.env.JWT_EXPIRESTOKEN,
//     }
//   );
//   user.token = token;
//   await user.save();

//   res
//     .status(200)
//     .cookie("token", token, {
//       expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//     })
//     .json({
//       success: true,
//       message: "Admin successfully login",
//       user,
//     });
// });