// ProfilePage.jsx

import React, { useState, useContext, useEffect } from "react";
import { UserDataContext } from "../components/contaxt/userContaxt";
import PostCard from "../components/PostCard";
import { postService } from "../services/postServices";
import {
  Calendar,
  Eye,
  EyeOff,
  Edit3,
  FileText,
} from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import Profilepost from "./profilepost";
import EditProfileModal from "./EditProfie";

export default function ProfilePage({
  isOwner,
  notUser
}
) {
  const navigate = useNavigate();
  const { userInfo } = useContext(UserDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [profile, setProfile] = useState(null); 
  const [no_of_posts, setNoOfPosts] = useState(0);
  const [no_of_created_communities, setNoOfCreatedCommunities] = useState(0);
  const [no_of_joined_communities, setNoOfJoinedCommunities] = useState(0);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // 2. Added explicit loading state

  // const isOwner = true;

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        await postService.chk_token();
        let user;
        if(isOwner){
          user = await postService.user_info();
        }
        else{
          user = await postService.not_user_info(notUser);
        }
        // console.log("Token is valid. User info:", user);
        // const user = await postService.user_info();
        
        // State updates are batched together
        setProfile(user.user);
        setNoOfPosts(user.no_of_posts);
        setNoOfCreatedCommunities(user.no_of_created_comm);
        setNoOfJoinedCommunities(user.no_of_join_comm);
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    loadContent();
  }, [navigate,isOwner,notUser]);

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <section className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-5 sm:px-7 pb-6 mt-20">
          
          <div className="-mt-14 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              
              <img
                src={profile.profile_photo}
                alt={profile.username}
                className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg bg-white"
              />

              
              <div className="pb-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {profile.username}
                </h1>

                <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined {formatDate(profile.created_at)}
                  </span>
                </div>
              </div>
            </div>

            
            {isOwner && (
              <button
                onClick={() => setOpenEditModal(true)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>

          
          <div className="mt-7">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3">
              Bio
            </h3>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
              {profile.bio}
            </p>
          </div>

          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-7">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase">Posts</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{no_of_posts}</h3>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-xs text-slate-400 font-semibold uppercase">Created Communities</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{no_of_created_communities}</h3>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 col-span-2 sm:col-span-1">
              <p className="text-xs text-slate-400 font-semibold uppercase">Joined Communities</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{no_of_joined_communities}</h3>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Posts</h2>
            <p className="text-sm text-slate-400 font-medium mt-1">
              All posts created by {profile.username}
            </p>
          </div>
        </div>
        <Profilepost />
      </section>

      {openEditModal && (
        <EditProfileModal
          isOpen={openEditModal}
          onClose={() => setOpenEditModal(false)}
          user={{
            username: profile.username,
            picture: profile.profile_photo,
            bio: profile.bio,
          }}
        />
      )}
    </div>
  );
}