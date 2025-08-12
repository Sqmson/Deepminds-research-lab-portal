import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        navigate('/');
      } else {
        await register(formData);
        toast.success('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({
          email: formData.email,
          password: '',
          firstName: '',
          lastName: '',
          role: 'student'
        });
      }
    } catch (error) {
      toast.error(error.message || `${isLogin ? 'Login' : 'Registration'} failed`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'student'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">DM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DeepMinds Lab</span>
            </div>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleMode}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Registration Fields */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john@must.ac.ug"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Role Selection for Registration */}
            {!isLogin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="student">Student</option>
                  <option value="professor">Professor</option>
                  <option value="visitor">Visiting Researcher</option>
                </select>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </button>
            </div>

            {/* Additional Links */}
            {isLogin && (
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            By signing {isLogin ? 'in' : 'up'}, you agree to our{' '}
            <Link to="/terms" className="text-blue-600 hover:text-blue-500 transition-colors">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;