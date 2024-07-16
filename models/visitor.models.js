import mongoose from 'mongoose';
import validator from 'validator';

const visitorSchema = new mongoose.Schema({
    token: {
        type: String,
    },
},
);

const visitor = mongoose.model("Visitor", visitorSchema);
export default visitor;