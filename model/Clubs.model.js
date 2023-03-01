import mongoose from 'mongoose';
const clubSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    url: {
        type: String
    }

});

export default mongoose.model("club", clubSchema);