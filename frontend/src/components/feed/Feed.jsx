"use client"

import { useState } from "react"
import { Heart, MessageCircle, Share2, MoreHorizontal, Edit, Trash2 } from "lucide-react"

// Mock data
const mockActivities = [
  {
    _id: "1",
    author: { name: "Alice" },
    title: "How to learn React",
    content: "React is awesome! Here are some tips...",
    tags: ["react", "javascript"],
    attachments: [],
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: "2",
    author: { name: "Bob" },
    title: "Tailwind CSS tricks",
    content: "I love using Tailwind for fast styling.",
    tags: ["tailwind", "css"],
    attachments: [],
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  },
]

const Feed = () => {
  const [activities, setActivities] = useState(mockActivities)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" })
  const currentUser = "Alice" // logged-in user

  // Like toggle
  const handleLike = (activityId) => {
    setActivities((prev) =>
      prev.map((activity) => {
        const isLiked = activity.likes.includes(currentUser)
        return {
          ...activity,
          likes: isLiked ? activity.likes.filter((id) => id !== currentUser) : [...activity.likes, currentUser],
        }
      }),
    )
  }

  // Comment
  const handleComment = (activityId, commentText) => {
    if (!commentText.trim()) return
    setActivities((prev) =>
      prev.map((activity) =>
        activity._id === activityId
          ? {
              ...activity,
              comments: [
                ...activity.comments,
                {
                  author: { name: currentUser },
                  text: commentText,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : activity,
      ),
    )
  }

  // Delete own post
  const handleDelete = (activityId) => {
    setActivities((prev) => prev.filter((activity) => activity._id !== activityId))
  }

  // Edit own post
  const handleEdit = (activityId, updatedData) => {
    setActivities((prev) =>
      prev.map((activity) => (activity._id === activityId ? { ...activity, ...updatedData } : activity)),
    )
  }

  // Create new post
  const handleCreatePost = (e) => {
    e.preventDefault()
    if (!newPost.title.trim() || !newPost.content.trim()) return

    setActivities((prev) => [
      {
        _id: Date.now().toString(),
        author: { name: currentUser },
        title: newPost.title,
        content: newPost.content,
        tags: newPost.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        likes: [],
        comments: [],
        attachments: [],
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ])
    setNewPost({ title: "", content: "", tags: "" })
    setShowCreateForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-xxl mx-auto space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-xl sm:text-2xl text-center font-bold text-gray-900">Activity Feed</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            {showCreateForm ? "Cancel" : "Create Activity"}
          </button>
        </div>

        {showCreateForm && (
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
        <div className="space-y-6">
          {activities.map((activity) => (
            <ActivityCard
              key={activity._id}
              activity={activity}
              currentUser={currentUser}
              onLike={handleLike}
              onComment={handleComment}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const ActivityCard = ({ activity, currentUser, onLike, onComment, onDelete, onEdit }) => {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({ title: activity.title, content: activity.content })

  const isLiked = activity.likes.includes(currentUser)
  const isOwnPost = activity.author.name === currentUser

  const handleSubmitComment = (e) => {
    e.preventDefault()
    onComment(activity._id, commentText)
    setCommentText("")
  }

  const handleEditSave = () => {
    onEdit(activity._id, editData)
    setEditing(false)
    setShowMenu(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
      <div className="p-6 pb-4 flex justify-between items-start">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
            {activity.author.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{activity.author.name}</h3>
            <p className="text-sm text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</p>
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

            {activity.tags.length > 0 && (
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
          </>
        )}
      </div>

      {!editing && (
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onLike(activity._id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isLiked
                  ? "text-red-600 bg-red-50 border border-red-200"
                  : "text-gray-600 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">{activity.likes.length}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{activity.comments.length}</span>
            </button>

            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </button>
          </div>

          {showComments && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              {activity.comments.map((comment, index) => (
                <div key={index} className="flex space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm font-semibold flex-shrink-0">
                    {comment.author.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-lg px-4 py-3">
                      <p className="font-semibold text-sm text-gray-900 mb-1">{comment.author.name}</p>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <form onSubmit={handleSubmitComment} className="flex space-x-3 mt-6">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  U
                </div>
                <div className="flex-1 flex space-x-3">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
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
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Feed
