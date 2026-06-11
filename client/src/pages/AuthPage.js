import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice';
import { authAPI } from '../api/endpoints';

function AuthPage() {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
        dispatch(setUser({ user: response.data.user, token: response.data.token }));
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const response = await authAPI.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          displayName: formData.username,
        });
        dispatch(setUser({ user: response.data.user, token: response.data.token }));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-htapp-dark via-purple-900 to-htapp-dark flex items-center justify-center p-4">
      <div className="bg-htapp-dark/80 backdrop-blur-lg border border-htapp-purple/30 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-htapp-pink to-htapp-purple bg-clip-text text-transparent">
          HTAPP
        </h1>
        <p className="text-center text-gray-400 mb-8">Your Digital Sanctuary</p>

        <h2 className="text-2xl font-semibold mb-6 text-white">
          {isLogin ? 'Welcome Back' : 'Join HTAPP'}
        </h2>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white"
                placeholder="Choose your username"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-htapp-dark/50 border border-htapp-purple/50 rounded-lg px-4 py-2 focus:outline-none focus:border-htapp-pink text-white"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-htapp-purple to-htapp-pink text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-htapp-pink hover:text-htapp-purple transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
