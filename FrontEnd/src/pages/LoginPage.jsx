import React, { useState ,useContext} from 'react';
import { Link, Navigate ,useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { userService } from '../services/userServices';
// import { }  from 'react';
import { UserDataContext}  from '../components/contaxt/userContaxt.jsx';
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { userInfo, setUserInfo, isLoggedIn, setIsLoggedIn } = useContext(UserDataContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login submission logic here
    // console.log(e);
    const credentials = { username, password };
    await userService.login(credentials)
      .then(response => {
        // username="";
        // password="";
        setUsername("");
        setPassword("");
        // console.log('Login response:', response);
        // <Navigate to="/home" />;
        setIsLoggedIn(true);
        setUserInfo({ username: response.user, picture: response.picture });
        // console.log("Login successful, user data:", response);
        navigate("/home");
        // Handle successful login
      })
      .catch(error => {
        // username="";
        // password="";
        setUsername("");
        setPassword("");
        console.error('Login error:', error);
        // Handle login error
      });
    // console.log('Logging in with:', { username, password });
  };

  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Enter your details to access your feed"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Username
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm placeholder-slate-400 font-medium"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-slate-700">
              Password
            </label>
            {/* <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Forgot password?
            </a> */}
          </div>
          <div className="relative rounded-xl shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm placeholder-slate-400 font-medium"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>


        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-[0.98] transition-all"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-slate-500 pt-2">
          New to Nexus?{' '}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}