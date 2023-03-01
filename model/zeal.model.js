import mongoose from 'mongoose';
const zeal = new mongoose.Schema({
    message: {
        type: String,
    },
    url: {
        type: String
    }

});

export default mongoose.model("zeal", zeal);