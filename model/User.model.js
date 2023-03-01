import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String
    },
    url: {
        type: String
    },
    role: {
        type: String,
        default: 'user'
    }
})

export default mongoose.model('Info', userSchema);