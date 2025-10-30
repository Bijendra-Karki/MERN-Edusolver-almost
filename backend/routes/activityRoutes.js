import express from 'express';
import { 
    createActivity, 
    listActivities, 
    readActivity, 
    addReply, 
    updateActivity, 
    deleteActivity, 
    updateComment
} from '../controllers/activityController.js';

// Import only the middleware actually used in this file
import { 
    requireUser,         
    requireStudent,      
    requireInstructor,
    requireSignin, // Used for staff replies (Admin OR Instructor)
} from '../controllers/authController.js'; 


const router = express.Router();

// ===============================================
// ROUTES
// ===============================================

// GET ALL ACTIVITIES (Activity Feed)
router.get('/activityList/all', requireSignin, requireUser, listActivities);

// GET SINGLE ACTIVITY (For details view)
router.get('/activityDetails/:activityId', requireSignin, requireUser, readActivity);

// CREATE NEW ACTIVITY/QUERY
// Authorization: Must be 'student'.
router.post('/activityCreate/new', requireSignin, requireStudent, createActivity);

// ADD REPLY/COMMENT TO ACTIVITY
// Authorization: Admin OR Instructor (handled by requireInstructor).
router.put('/activityReply/comment/:activityId', requireSignin, requireInstructor, addReply);

// UPDATE COMMENT
router.put("/commentUpdate/:activityId/:commentId", requireSignin, requireInstructor, updateComment);

// UPDATE ACTIVITY 
// Authorization: Must be signed in. Controller handles ownership.
router.put('/activityUpdate/:activityId', requireSignin, requireUser, updateActivity);

// DELETE ACTIVITY
// Authorization: Must be signed in. Controller handles ownership.
router.delete('/activityDelete/:activityId', requireSignin, requireUser, deleteActivity);


export default router;