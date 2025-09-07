import mongoose from 'mongoose';

const { Schema } = mongoose;

const subjectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

export default mongoose.model('Subject', subjectSchema);