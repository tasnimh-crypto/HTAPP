import React, { useState, useEffect } from 'react';
import { exploreAPI } from '../api/endpoints';

function ExplorePage() {
  const [trendingTags, setTrendingTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExploreData();
  }, []);

  const fetchExploreData = async () => {
    try {
      const tagsResponse = await exploreAPI.getTrendingTags();
      setTrendingTags(tagsResponse.data);

      const categoriesResponse = await exploreAPI.getCategories();
      setCategories(categoriesResponse.data.categories);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching explore data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-htapp-pink to-htapp-purple bg-clip-text text-transparent">
        Explore HTAPP
      </h1>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(category => (
            <button
              key={category}
              className="bg-gradient-to-br from-htapp-purple/50 to-htapp-pink/50 hover:from-htapp-purple to-htapp-pink rounded-lg p-6 text-center font-semibold transition-all hover:shadow-lg"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending Tags */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Trending Tags</h2>
        <div className="flex flex-wrap gap-3">
          {trendingTags.slice(0, 20).map(tag => (
            <button
              key={tag.tag}
              className="px-4 py-2 bg-htapp-purple/30 hover:bg-htapp-purple/60 rounded-full text-sm font-semibold transition-colors"
            >
              {tag.tag} ({tag.count})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
