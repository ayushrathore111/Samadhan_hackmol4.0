import mongoose from 'mongoose';
const netra = new mongoose.Schema({
    message: {
        type: String,
    },
    url: {
        type: String
    }

});

export default mongoose.model("netra", netra);