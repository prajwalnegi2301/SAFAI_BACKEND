import  asyncErrorHandler  from '../utils/asyncErrorHandler.js'
import ErrorHandler from '../utils/errorMiddleware.js';
import ContactUs from '../models/contactUs.models.js';


export const createMessage = asyncErrorHandler(async(req,res,next)=>{
    const{ name,message} = req.body;
    if(!message){
        return next(new ErrorHandler("Enter Feedback",400));
    }
    
    const newFeedback = new ContactUs({
        name,message
    })
    await newFeedback.save();

    res.status(200)
    .json({message:"message created",success:true,newFeedback});
});


export const getMessages = asyncErrorHandler(async(req,res,next)=>{
    const admin = req.user;
    if(!admin){
        return next(new ErrorHandler("Cannot find Admin",400));
    }
    const messages = await ContactUs.find();
    if(!messages){
        return next( new ErrorHandler("No messages",400));
    }
    res.status(200)
    .json({message:"messages..",success:true,messages});
});



