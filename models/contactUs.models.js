import mongoose, { mongo } from 'mongoose'

const contactUsSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    message:{
        type:String,
        required:true,
    }
})

const contactUs = mongoose.model('ContactUs',contactUsSchema)
export default contactUs;