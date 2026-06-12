import {useState} from 'react';
import { Search, LogIn, UserPlus, LogOut, Compass } from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import { useContext } from 'react';
import { UserDataContext } from './contaxt/userContaxt.jsx';
import { userService } from '../services/userServices';
export default function Navbar() {
  const navigate = useNavigate();
  const {userInfo, setUserInfo, isLoggedIn, setIsLoggedIn} = useContext(UserDataContext);
  const [search, setSearch] = useState("");
  const handleLoginClick = () => {
    // onLogInSimulate;
    navigate("/login");
  };
  const handlesignupClick = () => {
    navigate("/signup");
  };

    
    // 1. This is your existing logout logic
    const handleLogout = async () => {
      // Clear tokens, reset auth state, or redirect the user here
      // console.log("Logged out successfully!");
      // navigate("/logoutUser");
      await userService.logout()
      .then(response => {
        // console.log('Logout response:', response);
        setIsLoggedIn(false);
        setUserInfo('');
        navigate("/");
          // Handle successful logout if needed
        })
        .catch(error => {
          console.error('Logout error:', error);
          // Handle logout error if needed
        });
    };

    // 2. This is the confirmation interceptor
    const handleConfirmLogout = () => {
      const userConfirmed = window.confirm("Do you want to logout?");
      
      if (userConfirmed) {
        handleLogout(); // Only runs if they clicked "OK"
      }
      // If they clicked "Cancel", nothing happens and they stay logged in
  };
  // const handleinput=(e)=>{
  //   e.preventDefault();
  //   if (!search) {
  //     window.alert("Please enter a search term");
  //     return;
  //   }
  //   if(search[0]==="#")
  //   {
  //     // const data
  //     // navigate(`/community/${search.slice(1)}`);
  //   }
  //   else if(search[0]==="@")
  //   {
  //     // navigate(`/profile/${search.slice(1)}`);
  //   }
  //   else if(search[0]==="/")
  //   {
  //     // navigate(`/post/${search.slice(1)}`);
  //   }
  //   else
  //     {
  //       // console.log(search);
  //       window.alert("Invalid search");
  //       setSearch("");
  //     // navigate(`/post/${search}`);
  //   }
  // };
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm shadow-indigo-200">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">Nexus</span>
        </div>

        {/* Search Bar */}

        {/* <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
        <form 
        onSubmit={handleinput}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm placeholder-slate-400 font-medium"
            placeholder="Search posts, topics or communities..."
          />
        </form>
        </div> */}

        {/* Auth Conditionals */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            // console.log(user),
            <div className="flex items-center gap-3 bg-slate-50 p-1.5 pr-3 rounded-full border border-slate-100">
              <img
                src={userInfo?.picture}
                alt={userInfo.username}
                className="w-8 h-8 rounded-full border border-white object-cover shadow-sm"
              />
              <span className="text-sm font-semibold text-slate-700 hidden md:inline">
                {userInfo.username}
                {/* {console.log("Displaying username in Navbar:", userInfo)} */}
              </span>
              <button 
                onClick={handleConfirmLogout}
                className="p-1 hover:text-red-500 text-slate-400 rounded-lg transition-colors ml-1"
                title="Logout Sim"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={handleLoginClick}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-slate-50 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
              <button 
                onClick={handlesignupClick}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 hover:shadow-none transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}