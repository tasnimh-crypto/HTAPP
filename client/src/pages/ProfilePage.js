import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userAPI, postAPI, followAPI } from '../api/endpoints';
import PostCard from '../components/PostCard';

function ProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const profileResponse = await userAPI.getProfile(userId);
      setProfile(profileResponse.data);

      const postsResponse = await userAPI.getUserPosts(userId);
      setPosts(postsResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await followAPI.followUser(userId);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center items-center min-h-screen">User not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-htapp-purple to-htapp-pink rounded-xl mb-6"></div>

      {/* Profile Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-htapp-purple/30 border-4 border-htapp-purple -mt-16"></div>
          <div>
            <h1 className="text-3xl font-bold">{profile.display_name}</h1>
            <p className="text-gray-400">@{profile.username}</p>
            {profile.bio && <p className="mt-2 text-gray-300">{profile.bio}</p>}
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-htapp-pink font-semibold">{profile.followers} Followers</span>
              <span className="text-htapp-pink font-semibold">{profile.following} Following</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleFollow}
          className={`px-6 py-2 rounded-lg font-semibold ${
            isFollowing
              ? 'bg-gray-600 hover:bg-gray-700'
              : 'bg-gradient-to-r from-htapp-purple to-htapp-pink'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-gray-400">No posts yet</p>
        ) : (
          posts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
