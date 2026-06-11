import React, { useState } from 'react';
import { searchAPI } from '../api/endpoints';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await searchAPI.search(query, 'all');
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, users, tags..."
            className="flex-1 bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-3 focus:outline-none focus:border-htapp-pink text-white"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-htapp-purple to-htapp-pink rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Search
          </button>
        </div>
      </form>

      {loading && <p className="text-center text-gray-400">Searching...</p>}

      {results && (
        <div className="space-y-8">
          {results.users && results.users.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Users</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.users.map(user => (
                  <div key={user.id} className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-htapp-purple/30"></div>
                      <div>
                        <p className="font-semibold">{user.display_name}</p>
                        <p className="text-sm text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.posts && results.posts.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Posts</h2>
              <div className="space-y-4">
                {results.posts.map(post => (
                  <div key={post.id} className="bg-htapp-dark/50 border border-htapp-purple/30 rounded-lg p-4">
                    <p className="font-semibold text-sm text-gray-400">@{post.username}</p>
                    <p className="font-bold mt-2">{post.title}</p>
                    <p className="text-gray-300 text-sm mt-1">{post.content.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.tags && results.tags.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {results.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-htapp-purple/30 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
