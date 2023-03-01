import mongoose from 'mongoose';
const ladc = new mongoose.Schema({
    message: {
        type: String,
    },
    url: {
        type: String
    }

});

export default mongoose.model("ladc", ladc);