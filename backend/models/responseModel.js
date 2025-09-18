import mongoose from 'mongoose';
const { Schema, Schema: { ObjectId } } = mongoose;

const responseSchema = new Schema({
    query_id: { type: ObjectId, required: true, ref: 'Query' },
    user_id: { type: ObjectId, required: true, ref: 'User' },
    text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Response', responseSchema);
