import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { postAPI } from '../api/endpoints';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';

function HomePage() {
  const { user } = useSelector(state => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    try {
      const response = await postAPI.getFeed(20, 0);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feed:', error);
      setLoading(false);
    }
  };

  const handlePostCreated = async (newPost) => {
    setPosts([newPost, ...posts]);
    setShowCreateModal(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Create Post Section */}
      <div className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-htapp-purple/30"></div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex-1 bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 text-gray-400 hover:text-gray-300 hover:border-htapp-pink transition-colors text-left"
          >
            Share your thoughts, {user?.display_name}...
          </button>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      {/* Feed */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-htapp-pink"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
