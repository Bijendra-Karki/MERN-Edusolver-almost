"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MessageCircle, MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react"; // Added Check and X for edit buttons
import { getToken, isAuthenticated } from "../utils/authHelper";

// Feed Component (No changes needed here, as the fix is in ActivityCard)
const Feed = () => {
    // ... (rest of Feed component is unchanged) ...

    const [activities, setActivities] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [loadingUser, setLoadingUser] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });
    const [currentUser, setCurrentUser] = useState(null);

    const token = getToken();
    const authUser = isAuthenticated();
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    useEffect(() => {
        const fetchData = async () => {
            const jwt = localStorage.getItem("jwt");

            if (!jwt) {
                setLoadingActivities(false);
                setLoadingUser(false);
                return;
            }

            const parsedJwt = JSON.parse(jwt);
            setCurrentUser(parsedJwt.user);

            try {
                const activitiesRes = await axios.get("/api/activity/activityList/all", config);
                setActivities(activitiesRes.data);

            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Something went wrong while fetching initial data."
                );
            } finally {
                setLoadingActivities(false);
                setLoadingUser(false);
            }
        };

        fetchData();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        
        if (currentUser.role !== 'student') {
            alert("Only students can create activities.");
            return;
        }

        try {
            const response = await axios.post(
                "/api/activity/activityCreate/new",
                {
                    title: newPost.title,
                    content: newPost.content,
                    tags: newPost.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
                },
                config
            );
            setActivities([response.data, ...activities]);
            setNewPost({ title: "", content: "", tags: "" });
            setShowCreateForm(false);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create activity");
        }
    };

    const handleComment = async (activityId, commentText) => {
        const isStaff = currentUser.role === 'admin' || currentUser.role === 'expert' || currentUser.role === 'teacher';
        if (!isStaff) {
            alert("You are not authorized to reply to this activity.");
            return;
        }

        try {
            const response = await axios.put(
                `/api/activity/activityReply/comment/${activityId}`,
                { content: commentText },
                config
            );
            setActivities(activities.map(activity => activity._id === activityId ? response.data : activity));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to add comment");
        }
    };

    // 💡 NEW: Handler for editing an existing comment
    const handleEditComment = async (activityId, commentId, content) => {
  try {
    const response = await axios.put(
      `/api/activity/commentUpdate/${activityId}/${commentId}`,
      { content },
      config
    );

    // Replace updated activity in state
    setActivities((prev) =>
      prev.map((a) => (a._id === activityId ? response.data : a))
    );

    return true; // signal success to ActivityCard
  } catch (error) {
    console.error("Error updating comment:", error);
    alert(error.response?.data?.message || "Failed to update comment");
    return false; // signal failure to ActivityCard
  }
};

    const handleDelete = async (activityId) => {
        try {
            await axios.delete(
                `/api/activity/activityDelete/${activityId}`,
                config
            );
            setActivities(activities.filter(activity => activity._id !== activityId));
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete activity");
        }
    };

    const handleEdit = async (activityId, updatedData) => {
        try {
            const response = await axios.put(
                `/api/activity/activityUpdate/${activityId}`,
                updatedData,
                config
            );
            setActivities(activities.map(activity => activity._id === activityId ? response.data : activity));
        } catch (err) {
            alert(err.response?.data?.message || " Please refresh to view updated data.");
        }
    };

    if (loadingActivities || loadingUser) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-4">
            <div className="max-w-xxl mx-auto space-y-6 p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                    <h1 className="text-xl sm:text-2xl text-center font-bold text-gray-900">Activity Feed</h1>
                    {currentUser?.role === 'student' && (
                        <button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            {showCreateForm ? "Cancel" : "Create Activity"}
                        </button>
                    )}
                </div>

                {showCreateForm && (currentUser?.role === 'student') && (
                    // ... (Post creation form UI is unchanged) ...
                    <div className="bg-gray-100 rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <form onSubmit={handleCreatePost} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                            <textarea
                                placeholder="Content"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] text-gray-900"
                                rows={4}
                            />
                            <input
                                type="text"
                                placeholder="Tags (comma separated)"
                                value={newPost.tags}
                                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                            >
                                Post Activity
                            </button>
                        </form>
                    </div>
                )}

                {/* Activity Feed */}
                {loadingActivities ? (
                    <div className="text-center py-10 text-gray-600">Loading activities...</div>
                ) : (
                    <div className="space-y-6">
                        {activities.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">No activities found. Be the first to post!</p>
                        ) : (
                            activities.map((activity) => (
                                <ActivityCard
                                    key={activity._id}
                                    activity={activity}
                                    currentUser={currentUser}
                                    onComment={handleComment}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    // 💡 PASS NEW HANDLER
                                    onEditComment={handleEditComment} 
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}


// ActivityCard component (FIXED)
const ActivityCard = ({ activity, currentUser, onComment, onDelete, onEdit, onEditComment }) => {
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [showMenu, setShowMenu] = useState(false)
    const [editing, setEditing] = useState(false)
    const [editData, setEditData] = useState({ title: activity.title, content: activity.content })
    
    // 💡 NEW STATE: To track which comment is being edited and its content
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");


    const isOwnPost = activity.author._id === currentUser?._id
    // Correctly checks for Admin OR Expert OR Teacher
    const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'expert' || currentUser?.role === 'teacher';
    const canReply = isStaff;

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (canReply) {
            onComment(activity._id, commentText);
            setCommentText("");
        } else {
            alert("You are not authorized to reply to this activity.");
        }
    }

    const handleEditSave = () => {
        onEdit(activity._id, editData)
        setEditing(false)
        setShowMenu(false)
    }

    // 💡 NEW HANDLER: Save the edited comment
    const handleCommentEditSave = async (commentId) => {
        if (!editingCommentContent.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        // Call the prop function and wait for success
        const success = await onEditComment(activity._id, commentId, editingCommentContent);
        
        if (success) {
            setEditingCommentId(null); // Exit editing mode
            setEditingCommentContent("");
        }
    }

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

    const getCommentRoleDisplay = (role) => {
        if (role === 'teacher' || role === 'instructor') return 'Instructor';
        return role;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
            {/* ... (Post header and options menu UI is unchanged) ... */}
            <div className="p-6 pb-4 flex justify-between items-start">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {activity.author.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{activity.author.name}</h3>
                        <p className="text-sm text-gray-500">{formatDate(activity.createdAt)}</p>
                    </div>
                </div>
                {isOwnPost && (
                    <div className="relative flex-shrink-0 ml-4">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Post options"
                        >
                            <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                <button
                                    onClick={() => {
                                        setEditing(!editing)
                                        setShowMenu(false)
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-sm text-gray-700 rounded-t-lg"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                                <button
                                    onClick={() => onDelete(activity._id)}
                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 text-red-600 text-sm rounded-b-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="px-6 pb-4">
                {editing ? (
                    // ... (Post edit UI is unchanged) ...
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={editData.title}
                            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                        />
                        <textarea
                            value={editData.content}
                            onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] text-gray-900"
                            rows={4}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={handleEditSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditing(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{activity.title}</h2>
                        <p className="text-gray-700 leading-relaxed mb-4 text-base">{activity.content}</p>

                        {activity.tags && activity.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {activity.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        {activity.isResolved && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-300">
                                ✅ Resolved
                            </span>
                        )}
                    </>
                )}
            </div>

            {!editing && (
                <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => setShowComments(!showComments)}
                            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{activity.comments ? activity.comments.length : 0} Comments</span>
                        </button>
                    </div>

                    {showComments && (
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            {activity.comments && activity.comments.map((comment, index) => (
                                <div key={comment._id || index} className="flex space-x-3 mb-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 
                                            ${comment.authorRole === 'admin' ? 'bg-red-600 text-white' :
                                            (comment.authorRole === 'instructor' || comment.authorRole === 'teacher') ? 'bg-yellow-600 text-white' :
                                                'bg-gray-300 text-gray-700'
                                            }`}
                                    >
                                        {comment.author.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {/* 💡 NEW UI: Conditional rendering for edit mode */}
                                        {editingCommentId === comment._id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={editingCommentContent}
                                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
                                                    rows={2}
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleCommentEditSave(comment._id)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <Check className="w-3 h-3" /> Save
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingCommentId(null)}
                                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <X className="w-3 h-3" /> Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-lg px-4 py-3 relative">
                                                <p className="font-semibold text-sm text-gray-900 mb-1">
                                                    {comment.author.name}
                                                    {comment.authorRole && (
                                                        <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full 
                                                            ${comment.authorRole === 'admin' ? 'bg-red-100 text-red-600' :
                                                                (comment.authorRole === 'instructor' || comment.authorRole === 'teacher') ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-blue-100 text-blue-600'
                                                                }`}
                                                        >
                                                            {getCommentRoleDisplay(comment.authorRole)}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-gray-700">{comment.content}</p>

                                                {/* 💡 NEW UI: Edit Button for Comments */}
                                                {comment.author._id === currentUser?._id && (
                                                    <button
                                                        onClick={() => {
                                                            setEditingCommentId(comment._id);
                                                            setEditingCommentContent(comment.content);
                                                        }}
                                                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 rounded-full transition-colors"
                                                        title="Edit Comment"
                                                    >
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}

                            {canReply && (
                                <form onSubmit={handleSubmitComment} className="flex space-x-3 mt-6">
                                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {currentUser.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 flex space-x-3">
                                        <input
                                            type="text"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder="Write a reply..."
                                            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim()}
                                            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                        >
                                            Post
                                        </button>
                                    </div>
                                </form>
                            )}
                            {!canReply && (
                                <p className="text-center text-sm text-gray-500 pt-4">Only Staff (Instructors and Admins) can reply to activities.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Feed;