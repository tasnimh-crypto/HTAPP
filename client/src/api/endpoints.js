import API from './api';

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const userAPI = {
  getProfile: (userId) => API.get(`/users/${userId}`),
  updateProfile: (userId, data) => API.put(`/users/${userId}`, data),
  getUserPosts: (userId) => API.get(`/users/${userId}/posts`),
};

export const postAPI = {
  createPost: (data) => API.post('/posts', data),
  getFeed: (limit, offset) => API.get(`/posts/feed?limit=${limit}&offset=${offset}`),
  getPost: (postId) => API.get(`/posts/${postId}`),
  updatePost: (postId, data) => API.put(`/posts/${postId}`, data),
  deletePost: (postId) => API.delete(`/posts/${postId}`),
};

export const commentAPI = {
  createComment: (data) => API.post('/comments', data),
  getComments: (postId) => API.get(`/comments/post/${postId}`),
  getReplies: (commentId) => API.get(`/comments/${commentId}/replies`),
  updateComment: (commentId, data) => API.put(`/comments/${commentId}`, data),
  deleteComment: (commentId) => API.delete(`/comments/${commentId}`),
};

export const likeAPI = {
  likePost: (postId) => API.post(`/likes/post/${postId}`),
  likeComment: (commentId) => API.post(`/likes/comment/${commentId}`),
  savePost: (postId) => API.post(`/likes/save/${postId}`),
  getSavedPosts: (userId) => API.get(`/likes/user/${userId}`),
};

export const followAPI = {
  followUser: (userId) => API.post(`/follows/${userId}`),
  getFollowers: (userId) => API.get(`/follows/${userId}/followers`),
  getFollowing: (userId) => API.get(`/follows/${userId}/following`),
};

export const friendAPI = {
  sendRequest: (userId) => API.post(`/friends/request/${userId}`),
  acceptRequest: (requestId) => API.post(`/friends/accept/${requestId}`),
  getFriends: (userId) => API.get(`/friends/${userId}/friends`),
};

export const messageAPI = {
  sendMessage: (data) => API.post('/messages', data),
  getConversation: (userId) => API.get(`/messages/conversation/${userId}`),
  getThreads: () => API.get('/messages/threads'),
};

export const storyAPI = {
  createStory: (data) => API.post('/stories', data),
  addChapter: (storyId, data) => API.post(`/stories/${storyId}/chapters`, data),
  getStory: (storyId) => API.get(`/stories/${storyId}`),
  getChapter: (storyId, chapterId) => API.get(`/stories/${storyId}/chapters/${chapterId}`),
  getUserStories: (userId) => API.get(`/stories/user/${userId}`),
};

export const botAPI = {
  createBot: (data) => API.post('/bots', data),
  getBots: (limit, offset) => API.get(`/bots?limit=${limit}&offset=${offset}`),
  getUserBots: (userId) => API.get(`/bots/user/${userId}`),
  getBot: (botId) => API.get(`/bots/${botId}`),
  startChat: (botId) => API.post(`/bots/${botId}/chat`),
  sendChatMessage: (chatId, data) => API.post(`/bots/chat/${chatId}/message`, data),
};

export const communityAPI = {
  createCommunity: (data) => API.post('/communities', data),
  getCommunity: (communityId) => API.get(`/communities/${communityId}`),
  joinCommunity: (communityId) => API.post(`/communities/${communityId}/join`),
  postInCommunity: (communityId, data) => API.post(`/communities/${communityId}/post`, data),
  getCommunityPosts: (communityId) => API.get(`/communities/${communityId}/posts`),
};

export const searchAPI = {
  search: (query, type) => API.get(`/search?q=${query}&type=${type}`),
};

export const exploreAPI = {
  getTrendingTags: () => API.get('/explore/trending-tags'),
  getTagPosts: (tag) => API.get(`/explore/tag/${tag}`),
  getTrendingPosts: () => API.get('/explore/trending-posts'),
  getCategories: () => API.get('/explore/categories'),
};
