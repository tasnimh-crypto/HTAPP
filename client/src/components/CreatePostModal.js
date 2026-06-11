import React, { useState } from 'react';
import { postAPI } from '../api/endpoints';

function CreatePostModal({ onClose, onPostCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    postType: 'text',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await postAPI.createPost({
        title: formData.title || undefined,
        content: formData.content,
        postType: formData.postType,
      });
      onPostCreated(response.data);
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-htapp-dark border border-htapp-purple/30 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a Post</h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Post Type</label>
            <select
              name="postType"
              value={formData.postType}
              onChange={handleChange}
              className="w-full bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="quote">Quote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title (Optional)</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white"
              placeholder="Give your post a title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="w-full bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white resize-none"
              rows="5"
              placeholder="Share your thoughts..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-htapp-purple to-htapp-pink text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePostModal;
