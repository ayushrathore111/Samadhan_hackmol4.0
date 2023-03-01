import mongoose from 'mongoose';
const rtist = new mongoose.Schema({
    message: {
        type: String,
    },
    url: {
        type: String
    }

});

export default mongoose.model("rtist", rtist);