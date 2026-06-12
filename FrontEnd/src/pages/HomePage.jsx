import React, { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import CommunityTable from "../components/CommunityTable";
import JoinCommunityTable from "../components/JoinedCommunityTable";
import { postService } from "../services/postServices";
import {useContext} from 'react';
import { UserDataContext } from "../components/contaxt/userContaxt";
import HomeFeed from "./HomeFeed";
import TrendingFeed from "./TrendingFeed";
import GlobalFeed from "./GlobalFeed";
import ProfilePage from "./profile";
import CreatePostModal from "./CreatePost";
import CreateCommunityModal from "../components/CreateCommunity";
import CommunityChat from "../components/CommunityChat";
import {
    Home,
    Flame,
    Globe,
    Sparkles,
    User,
    Settings,
    Bookmark,
    Bell,
    MessageSquare,
    Compass,
    Shield,
    HelpCircle,
    Plus,
    CirclePlus,
} from "lucide-react";

export default function HomePage() {
    const { userInfo, setUserInfo, isLoggedIn, setIsLoggedIn } = useContext(UserDataContext);
    const [activeFeed, setActiveFeed] = useState("home");
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openCreateComm,setopenCreateComm] = useState(false);
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    useEffect(() => {
        const loadContent = async () => {
            try {
    //             setLoading(true);
    //             // 1. Check if the token exists in localStorage
    //             // const token = Cookies.get('token');

    //             // 2. Fetch data based on token presence
                
                const data = await postService.get_post();
                // {console.log("data -> ",data);}
                if(data) {
                    setIsLoggedIn(true);
                    setUserInfo({ username: data.user.username, picture: data.user.profile_photo });
                }
    //             setposts(data);
    //             // console.log(data);
            } catch (err) {
                console.log("Error fetching posts:", err.message);
                // setError(err.message);
            } finally {
                // setLoading(false);
                console.log("Finished loading ");
            }
        };

        loadContent();
    }, []);



    const getTabClass = (type) => `
    w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all border-l-2
    ${activeFeed === type
            ? "bg-indigo-50/60 text-indigo-600 border-indigo-600 font-extrabold"
            : "text-slate-600 border-transparent hover:bg-slate-50/80 hover:text-slate-900"
        }
  `;

    const getSideBtnClass = () => `
    w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all rounded-xl hover:bg-slate-50 hover:text-slate-900
  `;
    
    return (
        // Fixed viewport container prevents general screen page breaking
        <div className="h-screen w-screen bg-white text-slate-900 font-sans flex flex-col overflow-hidden">
            {/* Static Navbar */}
            {/* {console.log("Rendering HomePage with user info:", userInfo, "Logged in:", isLoggedIn)} */}
            <Navbar/>

            {/* Main Framework Grid: Calc screens height dynamically minus the header offset */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 h-[calc(100vh-61px)] overflow-hidden">
                {/* Column 1: Left Nav Column - Independent Scroll */}
                <aside className="hidden md:flex md:col-span-1 lg:col-span-2 border-r border-slate-100 bg-white h-full flex-col overflow-y-auto custom-scrollbar py-4 no-scrollbar">
                    {/* Main Feeds Group */}
                    <div className="space-y-0.5">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-4 mb-2">
                            Feeds
                        </p>
                        <button
                            onClick={() => setActiveFeed("home")}
                            className={getTabClass("home")}
                        >
                            <Home className="w-4 h-4" />
                            <span>Home Feed</span>
                        </button>
                        <button
                            onClick={() => setActiveFeed("trending")}
                            className={getTabClass("trending")}
                        >
                            <Flame className="w-4 h-4" />
                            <span>Trending</span>
                        </button>
                        <button
                            onClick={() => setActiveFeed("global")}
                            className={getTabClass("global")}
                        >
                            <Globe className="w-4 h-4" />
                            <span>Global</span>
                        </button>
                    </div>

                    {/* User Operations Group (Simulating heavy link list overflow items) */}
                    <div className="space-y-0.5 mt-6">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-4 mb-2">
                            My Account
                        </p>
                        <button className={getTabClass("profilepage")}
                            onClick={() => setActiveFeed("profilepage")}>
                            <User className="w-4 h-4" />
                            <span>Profile</span>
                        </button>
                        <button className={getTabClass("Create_Post")}
                                onClick={() => {setActiveFeed("Create_Post"); setOpenCreateModal(true)}}>
                            <Plus className="w-4 h-4" />
                            <span>Create Post</span>
                        </button>
                        <button className={getTabClass("Create_comm")}
                            onClick={() => {setActiveFeed("Create_comm"); setopenCreateComm(true)}}>
                            <CirclePlus  className="w-4 h-4" />
                            <span>Create Community</span>
                        </button>
                        {/* <button className={getSideBtnClass()}>
                            <Bookmark className="w-4 h-4" />
                            <span>Saved Posts</span>
                        </button>
                        <button className={getSideBtnClass()}>
                            <Compass className="w-4 h-4" />
                            <span>Explore Topics</span>
                        </button> */}
                    </div>

                    {/* Preferences Group */}
                    {/* <div className="space-y-0.5 mt-6 px-2">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-2">
                            Preferences
                        </p>
                        <button className={getSideBtnClass()}>
                            <Settings className="w-4 h-4" />
                            <span>Settings</span>
                        </button>
                        <button className={getSideBtnClass()}>
                            <Shield className="w-4 h-4" />
                            <span>Privacy Policy</span>
                        </button>
                        <button className={getSideBtnClass()}>
                            <HelpCircle className="w-4 h-4" />
                            <span>Support Hub</span>
                        </button>
                    </div> */}

                    {/* Footer block pinned to base track */}
                    <div className="mt-auto pt-8 px-4 text-xs text-slate-400 font-medium">
                        &copy; 2026 xyz network
                    </div>
                </aside>

                {/* Column 2: Center Main Content Stream - Independent Scroll */}
                <main className="col-span-1 md:col-span-3 lg:col-span-7 bg-slate-50/40 h-full overflow-y-auto p-4 sm:p-6 no-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-5">
                        {(activeFeed === "home") ?(
                            <HomeFeed />
                        ) : (activeFeed === "trending") ? (
                            <TrendingFeed />
                        ):(activeFeed === "global")?(
                            <GlobalFeed />
                        ):(activeFeed === "profilepage")?(
                            <ProfilePage isOwner={true} notUser={null}/>
                        ):(activeFeed === "community_chat") ? (
                            <CommunityChat
                                community={selectedCommunity}
                            />
                        ):(activeFeed === "Create_Post")?(
                            <CreatePostModal 
                                isOpen={openCreateModal}
                                onClose={() => setOpenCreateModal(false)}
                            />
                        ):(activeFeed === "Create_comm")?(
                            <CreateCommunityModal 
                                isOpen={openCreateComm}
                                onClose={() => setopenCreateComm(false)}
                            />
                        ):(null)
                        }
                    </div>
                </main>

                {/* Column 3: Right Widget Panel - Independent Scroll */}
                <aside className="hidden lg:block lg:col-span-3 bg-white border-l border-slate-100 h-full overflow-y-auto p-4 no-scrollbar">
                    <CommunityTable  
                        setActiveFeed={setActiveFeed}
                        setSelectedCommunity={setSelectedCommunity}
                    />
                    <br />
                    {/* (isloggedin)?():() */}
                    {isLoggedIn ? (
                        // console.log("Rendering JoinedCommunityTable for logged in user:", userInfo),
                        <JoinCommunityTable  
                            setActiveFeed={setActiveFeed}
                            setSelectedCommunity={setSelectedCommunity}
                        />
                    ) : (null)}

                    {/* Extra placeholder widgets can sit below the table and scroll cleanly */}
                    {/* <div className="mt-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-xs text-slate-500 font-medium">
            <p className="font-bold text-slate-700 mb-1">Trending Rules</p>
            Keep conversations constructive and clear. Be mindful of links shared inside custom community feeds.
          </div> */}
                </aside>
            </div>
        </div>
    );
}
