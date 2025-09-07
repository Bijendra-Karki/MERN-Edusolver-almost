

import { useState } from "react"
import PostCreator from "./FeedCreator"
import PostItem from "./PostItem"


const initialPosts = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      role: "Senior Expert",
      avatar: "SC",
      badge: "expert",
    },
    content:
      "Just discovered a game-changing approach to state management in React using Zustand. The boilerplate reduction is incredible compared to Redux. Here's why I'm making the switch for our next project:\n\n• Zero boilerplate\n• TypeScript-first design\n• Devtools support\n• Tiny bundle size (2.9kb)\n\nAnyone else experimenting with Zustand? Would love to hear your experiences!",
    timestamp: "2 hours ago",
    likes: 24,
    comments: 8,
    tags: ["React", "State Management", "Zustand"],
  },
  {
    id: 2,
    author: {
      name: "Mike Rodriguez",
      role: "Platform Admin",
      avatar: "MR",
      badge: "admin",
    },
    content:
      "🚀 New deployment pipeline is live! We've reduced our CI/CD time from 15 minutes to 3 minutes using:\n\n✅ Docker layer caching\n✅ Parallel test execution\n✅ Smart dependency caching\n✅ Incremental builds\n\nDeveloper productivity just got a major boost. The team can now ship features 5x faster!",
    timestamp: "4 hours ago",
    likes: 42,
    comments: 12,
    tags: ["DevOps", "CI/CD", "Docker", "Performance"],
  },
  {
    id: 3,
    author: {
      name: "Dr. Emily Watson",
      role: "AI/ML Expert",
      avatar: "EW",
      badge: "expert",
    },
    content:
      "Fascinating breakthrough in code generation AI! GPT-4 Turbo is now generating production-ready React components with 89% accuracy. \n\nKey insights from our 30-day trial:\n• Reduced component development time by 60%\n• Improved code consistency across teams\n• Better accessibility compliance\n• Fewer bugs in initial implementations\n\nThe future of development is here. Are you ready to embrace AI-assisted coding?",
    timestamp: "6 hours ago",
    likes: 67,
    comments: 23,
    tags: ["AI", "GPT-4", "Code Generation", "React"],
  },
  {
    id: 4,
    author: {
      name: "Alex Thompson",
      role: "Security Expert",
      avatar: "AT",
      badge: "expert",
    },
    content:
      "🔒 Critical security update for all Node.js applications!\n\nJust patched a vulnerability in our authentication system. Here's what every developer should check:\n\n1. Update to Node.js 18.19.0+\n2. Review JWT token expiration policies\n3. Implement rate limiting on auth endpoints\n4. Enable 2FA for admin accounts\n5. Audit third-party dependencies\n\nSecurity isn't optional - it's essential. Stay vigilant, stay secure! 🛡️",
    timestamp: "1 day ago",
    likes: 89,
    comments: 15,
    tags: ["Security", "Node.js", "Authentication", "JWT"],
  },
]

export default function Feed() {
  const [posts, setPosts] = useState(initialPosts)

  const handleNewPost = (newPost) => {
    const post = {
      id: Date.now(),
      author: {
        name: "Current User",
        role: "Platform Admin",
        avatar: "CU",
        badge: "admin",
      },
      content: newPost.content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      tags: newPost.tags,
    }
    setPosts([post, ...posts])
  }

  const handleLike = (postId) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  return (
    <div className="space-y-6">
      <PostCreator onSubmit={handleNewPost} />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} onLike={handleLike} />
        ))}
      </div>
    </div>
  )
}
