const Activity = require("../models/activityModel")

// ✅ Create new activity (post/share knowledge)
exports.createActivity = async (req, res) => {
  try {
    const { title, content, tags, attachments, visibility } = req.body

    const activity = new Activity({
      title,
      content,
      author: req.user._id, // user comes from auth middleware
      tags,
      attachments,
      visibility,
    })

    await activity.save()
    res.status(201).json(activity)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ✅ Get all activities (public feed)
exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("author", "name email")
      .populate("comments.author", "name email")
      .sort({ createdAt: -1 })

    res.json(activities)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ✅ Get single activity by ID
exports.getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.author", "name email")

    if (!activity) return res.status(404).json({ error: "Activity not found" })
    res.json(activity)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ✅ Like / Unlike activity
exports.toggleLike = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) return res.status(404).json({ error: "Activity not found" })

    const userId = req.user._id
    const alreadyLiked = activity.likes.includes(userId)

    if (alreadyLiked) {
      activity.likes.pull(userId) // unlike
    } else {
      activity.likes.push(userId) // like
    }

    await activity.save()
    res.json({ likes: activity.likes.length })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ✅ Add comment
exports.addComment = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) return res.status(404).json({ error: "Activity not found" })

    const comment = {
      text: req.body.text,
      author: req.user._id,
    }

    activity.comments.push(comment)
    await activity.save()

    res.status(201).json(activity.comments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ✅ Update activity (only author can edit)
exports.updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) return res.status(404).json({ error: "Activity not found" })

    if (activity.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    const { title, content, tags, visibility } = req.body
    if (title) activity.title = title
    if (content) activity.content = content
    if (tags) activity.tags = tags
    if (visibility) activity.visibility = visibility

    await activity.save()
    res.json(activity)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ✅ Delete activity (only author or admin)
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
    if (!activity) return res.status(404).json({ error: "Activity not found" })

    if (
      activity.author.toString() !== req.user._id.toString() &&
      req.user.role !== 1 // assume role=1 is admin
    ) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    await activity.remove()
    res.json({ msg: "Activity deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
