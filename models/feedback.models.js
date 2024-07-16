import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
  
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
    },
    workerName: {
      type: String,
    },
    review:{
      type:String,
    },
    rating:{
      type:String,
      enum:["1","2","3","4","5"],
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const feedback = mongoose.model("Feedback", feedbackSchema);
export default feedback;
