import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import ErrorHandler from "../utils/errorMiddleware.js";
import User from '../models/user.models.js';
import jwt from 'jsonwebtoken';


// ADMIN AUTHENTICATION AND AUTHORIZATION->
export const isAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokena } = req.cookies
    if(!tokena){
        return next(new ErrorHandler("Admin Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokena,process.env.JWT_SECRETA);
    req.user = await User.findById(decoded.id);

    //AUTHORIZATION->
    if(req.user.role !== "Admin"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})



// CUSTOMER AUTHNETICATION AND AUTHORIZATION->
export const isUserAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokenc } = req.cookies

    if(!tokenc){
        return next(new ErrorHandler("Customer Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokenc,process.env.JWT_SECRETC);
    req.user = await User.findById(decoded.id);
    
    // AUTHORIZATION->
    if(req.user.role !=="User"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})


// Worker AUTHNETICATION AND AUTHORIZATION->
export const isWorkerAuthenticated = asyncErrorHandler(async(req,res,next)=>{
    // AUTHENTICATION->
    const { tokenw } = req.cookies

    if(!tokenw){
        return next(new ErrorHandler("Worker Not Authenticated", 401));
    }
    const decoded = jwt.verify(tokenw,process.env.JWT_SECRETW);
    req.user = await User.findById(decoded.id);
    
    // AUTHORIZATION->
    if(req.user.role !=="Worker"){
        return next(
            new ErrorHandler(
                `${req.user.role} not submitted for this resources!`,
                403
            )
        );
    }
    next();
})