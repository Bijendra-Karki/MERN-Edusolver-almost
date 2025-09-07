import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Token', tokenSchema);
