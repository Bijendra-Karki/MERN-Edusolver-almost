import Activity from '../models/activityModel.js'; 

// --- Helper function for Role Standardization ---
const getAuthorRole = (req) => {
    const role = req.auth?.role;

    // Standardize 'teacher' and 'expert' roles to 'expert' for DB consistency
    if (role === 'teacher' || role === 'expert') {
        return 'expert';
    }
    
    // Allow 'admin' and 'student' directly
    if (role === 'admin' || role === 'student') {
        return role;
    }
    
    // Fallback
    return 'student'; 
};
// -------------------------------------------------------------------------

// ===========================================
// 1. CREATE NEW QUERY (POST /api/activity/new) - Middleware: requireStudent
// ===========================================
export const createActivity = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        
        const newActivity = new Activity({
            title,
            content,
            author: req.auth._id, // User ID from authentication token
            tags: tags,
        });

        const savedActivity = await newActivity.save();

        const populatedActivity = await savedActivity
            .populate('author', 'name role')
            .select('-__v');

        res.status(201).json(populatedActivity);

    } catch (error) {
        // Assume errorHandler is a function that formats and sends the error response
        return errorHandler(res, error, "Failed to create new query."); 
    }
};

// ===========================================
// 2. GET ALL QUERIES (GET /api/activity/all) - Middleware: requireUser
// ===========================================
export const listActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .populate('author', 'name role') 
            .populate('comments.author', 'name role')
            .sort({ createdAt: -1 }) 
            .select('-__v');

        res.json(activities);
    } catch (error) {
        return errorHandler(res, error, "Failed to fetch activities list.");
    }
};

// ===========================================
// 3. GET SINGLE QUERY (GET /api/activity/:activityId) - Middleware: requireUser
// ===========================================
export const readActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.activityId)
            .populate('author', 'name role')
            .populate('comments.author', 'name role')
            .select('-__v');

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        res.json(activity);
    } catch (error) {
        return errorHandler(res, error, "Failed to read activity.");
    }
};

// ===========================================
// 4. ADD REPLY/COMMENT (PUT /api/activity/comment/:activityId) - Middleware: requireInstructor
// ===========================================
export const addReply = async (req, res) => {
    try {
        const { content } = req.body;
        const activityId = req.params.activityId;
        
        // 1. Essential validation
        if (!content || content.trim() === '') {
             return res.status(400).json({ message: "Comment content cannot be empty." });
        }
        
        // 2. Get the role, ensuring it's standardized for Mongoose
        // Role is GUARANTEED to be staff by the requireInstructor middleware
        const userRole = getAuthorRole(req); 
        
        const reply = {
            content,
            author: req.auth._id,
            authorRole: userRole, 
            createdAt: new Date(),
        };

        const updatedActivity = await Activity.findByIdAndUpdate(
            activityId,
            { $push: { comments: reply } }, 
            { 
                new: true,
                runValidators: true // Enforce role enum validation
            }
        )
        .populate('author', 'name role')
        .populate('comments.author', 'name role')
        .select('-__v');

        if (!updatedActivity) {
            return res.status(404).json({ message: "Activity not found for commenting." });
        }

        res.json(updatedActivity);

    } catch (error) {
        return errorHandler(res, error, "Failed to post reply.");
    }
};

// ===========================================
// 7. UPDATE COMMENT (PUT /api/activity/commentUpdate/:activityId/:commentId)
// ===========================================
export const updateComment = async (req, res) => {
  try {
    const { activityId, commentId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Comment content cannot be empty." });
    }

    // Find the activity first
    const activity = await Activity.findById(activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found." });
    }

    // Find the comment inside the activity
    const comment = activity.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Check authorization — only comment author or admin can edit
    const isAuthor = comment.author.equals(req.auth._id);
    const isAdmin = req.auth?.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ message: "You are not authorized to edit this comment." });
    }

    // Update comment content
    comment.content = content;
    comment.updatedAt = new Date();

    await activity.save();

    // Re-populate for fresh return
    const updatedActivity = await Activity.findById(activityId)
      .populate("author", "name role")
      .populate("comments.author", "name role")
      .select("-__v");

    res.json(updatedActivity);
  } catch (error) {
    console.error("Update comment error:", error);
    return errorHandler(res, error, "Failed to update comment.");
  }
};


// ===========================================
// 5. UPDATE QUERY (PUT /api/activity/:activityId) - Middleware: requireUser
// ===========================================
export const updateActivity = async (req, res) => {
    try {
        const { title, content, tags, isResolved } = req.body;

        const activity = await Activity.findById(req.params.activityId);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        // Authorization check: Only the original author can edit it.
        const isAuthor = activity.author.equals(req.auth._id);
        
        if (!isAuthor) {
            return res.status(403).json({ message: "You are not authorized to edit this activity." });
        }

        if (title) activity.title = title;
        if (content) activity.content = content;
        if (tags !== undefined) activity.tags = tags; 
        if (isResolved !== undefined) activity.isResolved = isResolved;
        
        const updatedActivity = await activity.save();
        
        const populatedActivity = await updatedActivity
            .populate('author', 'name role')
            .populate('comments.author', 'name role')
            .select('-__v');
            
        res.json(populatedActivity);
    } catch (error) {
        return errorHandler(res, error, "Failed to update activity.");
    }
};


// ===========================================
// 6. DELETE QUERY (DELETE /api/activity/:activityId) - Middleware: requireUser
// ===========================================
export const deleteActivity = async (req, res) => {
    try {
        const activity = await Activity.findById(req.params.activityId);

        if (!activity) {
            return res.status(404).json({ message: "Activity not found." });
        }

        // Authorization check: Only the original author can delete it.
        const isAuthor = activity.author.equals(req.auth._id);
        
        if (!isAuthor) {
            return res.status(403).json({ message: "You are not authorized to delete this activity." });
        }

        await Activity.deleteOne({ _id: req.params.activityId });
        
        res.json({ message: "Activity successfully deleted." });

    } catch (error) {
        return errorHandler(res, error, "Failed to delete activity.");
    }
};