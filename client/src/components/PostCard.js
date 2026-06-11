import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`}>
      <div className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-xl p-6 hover:border-htapp-pink transition-colors cursor-pointer hover:shadow-lg hover:shadow-htapp-pink/20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-htapp-purple/30"></div>
          <div>
            <p className="font-semibold text-sm">{post.display_name}</p>
            <p className="text-xs text-gray-400">@{post.username}</p>
          </div>
        </div>

        {/* Content */}
        {post.title && <h3 className="text-lg font-bold mb-2">{post.title}</h3>}
        <p className="text-gray-200 mb-4 line-clamp-3">{post.content}</p>

        {/* Image */}
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            className="w-full rounded-lg mb-4 max-h-60 object-cover"
          />
        )}

        {/* Engagement */}
        <div className="flex gap-6 text-sm text-gray-400 border-t border-htapp-purple/20 pt-4">
          <div className="flex items-center gap-2">❤️ {post.like_count || 0}</div>
          <div className="flex items-center gap-2">💬 {post.comment_count || 0}</div>
          <div className="flex items-center gap-2">🔖 {post.save_count || 0}</div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
