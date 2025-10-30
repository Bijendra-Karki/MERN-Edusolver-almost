import mongoose from 'mongoose';

// The Sub-Schema for Replies (Comments)
const replySchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true,
        trim: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    // CRITICAL: Standardized roles for replies
    authorRole: { 
        type: String, 
        enum: ['student', 'expert', 'admin'], 
        required: true 
    },
}, { _id: true }); 

// Activity Schema (Student Queries)
const activitySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // The student who posted the query
            required: true,
        },
        // Simple tags for easy filtering by topic
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        // Array of replies/comments
        comments: [replySchema],

        // Flag set by the student or admin when the query is answered
        isResolved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// 💡 ES MODULE EXPORT
export default mongoose.model("Activity", activitySchema);