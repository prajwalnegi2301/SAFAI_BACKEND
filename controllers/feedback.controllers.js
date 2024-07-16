import  asyncErrorHandler  from '../utils/asyncErrorHandler.js';
import ErrorHandler from '../utils/errorMiddleware.js';
import Feedback from '../models/feedback.models.js';


export const createFeedback = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    const workerId = id;
    const user = req.user;
    const userId = user._id;
    const userName = user.name;
    const{ review,rating} = req.body;
    if(!review || !rating){
        return next(new ErrorHandler("Enter Feedback",400));
    }
    const newFeedback = new Feedback({
        review, rating,  userName, userId, workerId
    })
    
    await newFeedback.save();

    res.status(200)
    .json({message:"message created",success:true,newFeedback});
});


export const getFeedbacks = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    
    const feedbacks = await Feedback.find({workerId:id});
    if (!feedbacks || feedbacks.length === 0) {
        return next(new ErrorHandler("No feedbacks for this worker", 400));
    }
    res.status(200)
    .json({messages:"feedbacks..",success:true,feedbacks});
});



