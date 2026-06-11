import React, { useState, useEffect } from 'react';
import { postAPI, commentAPI, likeAPI } from '../api/endpoints';
import { useParams } from 'react-router-dom';

function PostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    try {
      const postResponse = await postAPI.getPost(postId);
      setPost(postResponse.data);

      const commentsResponse = await commentAPI.getComments(postId);
      setComments(commentsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await likeAPI.likePost(postId);
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await commentAPI.createComment({
        postId: parseInt(postId),
        content: newComment,
      });
      setNewComment('');
      fetchPost();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!post) {
    return <div className="flex justify-center items-center min-h-screen">Post not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Post Header */}
      <div className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-htapp-purple/30"></div>
          <div>
            <p className="font-semibold">{post.display_name}</p>
            <p className="text-sm text-gray-400">@{post.username}</p>
          </div>
        </div>

        {post.title && <h1 className="text-2xl font-bold mb-4">{post.title}</h1>}
        <p className="text-gray-200 mb-4">{post.content}</p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full rounded-lg mb-4 max-h-96 object-cover"
          />
        )}

        {/* Engagement */}
        <div className="flex gap-6 text-sm text-gray-400 border-t border-htapp-purple/20 pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 hover:text-htapp-pink transition-colors ${
              liked ? 'text-htapp-pink' : ''
            }`}
          >
            ❤️ {post.like_count || 0}
          </button>
          <div className="flex items-center gap-2">
            💬 {post.comment_count || 0}
          </div>
          <div className="flex items-center gap-2">
            🔖 {post.save_count || 0}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Comments</h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-xl p-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-transparent border-0 text-white focus:outline-none resize-none"
            rows="3"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-gradient-to-r from-htapp-purple to-htapp-pink rounded-lg text-white font-semibold hover:shadow-lg transition-all"
          >
            Post Comment
          </button>
        </form>

        {/* Comments List */}
        {comments.map(comment => (
          <div key={comment.id} className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-htapp-purple/30"></div>
              <div>
                <p className="font-semibold text-sm">{comment.display_name}</p>
                <p className="text-xs text-gray-400">@{comment.username}</p>
              </div>
            </div>
            <p className="text-gray-200">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostPage;
