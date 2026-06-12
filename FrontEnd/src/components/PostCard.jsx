import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import MediaCarousel from './MediaCarousel';
import UpdatePostModal from './EditPost';
import { useContext } from 'react';
import { UserDataContext } from './contaxt/userContaxt.jsx';
import { postService } from '../services/postServices';
import PostCommentsModal from "../components/PostCommentsModal.jsx";
import ProfilePage from '../pages/profile.jsx';
export default function PostCard({ post, isowner }) {
  // const {userInfo} = useContext(UserDataContext);
  // const [notOwner, setNotOwner] = useState(null);
  // const [openProfile, setopenProfile] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [liked, setLiked] = useState(
    post.isliked || false
  );
  const [openComments, setOpenComments] = useState(false);
  // console.log("post -> ",post);
  // console.log("-----------------------------------");
  const [likeCount, setLikeCount] = useState(
    post.likes || 0
  );
  function formatRelativeTime(dateString) {
    const inputDate = new Date(dateString);
    const now = new Date();

    // Calculate the difference in seconds
    const deltaSeconds = Math.round((inputDate - now) / 1000);

    // Array of time units and their values in seconds
    const units = [
      { name: 'year', seconds: 31536000 },
      { name: 'month', seconds: 2592000 },
      { name: 'week', seconds: 604800 },
      { name: 'day', seconds: 86400 },
      { name: 'hour', seconds: 3600 },
      { name: 'minute', seconds: 60 },
      { name: 'second', seconds: 1 }
    ];

    // Find the appropriate unit to format with
    for (const unit of units) {
      if (Math.abs(deltaSeconds) >= unit.seconds || unit.name === 'second') {
        const value = Math.round(deltaSeconds / unit.seconds);

        // Initialize the built-in RelativeTimeFormat API (defaults to browser language)
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        return rtf.format(value, unit.name);
      }
    }
  }
  const handleLike = async () => {

    // =====================================
    // OPTIMISTIC UI UPDATE
    // =====================================

    const previousLiked = liked;

    setLiked(!previousLiked);

    setLikeCount(prev =>
      previousLiked
        ? prev - 1
        : prev + 1
    );

    try {

      // =====================================
      // BACKEND API CALL
      // =====================================

      // await likePost(post.post_id);
      const userdata = new FormData();
      userdata.append("post_id", post.post_id);
      // userdata.append("username",userInfo.username);
      const data = await postService.like_post(userdata);
      console.log(
        previousLiked
          ? "Unlike Post"
          : "Like Post",
        post.post_id
      );

    } catch (err) {

      console.log(err);

      // =====================================
      // ROLLBACK IF FAILED
      // =====================================

      setLiked(previousLiked);

      setLikeCount(prev =>
        previousLiked
          ? prev + 1
          : prev - 1
      );
    }
  };
  // --- Testing with your exact timestamp ---
  // const sampleData = "2026-05-19T19:24:08.770Z"; 
  // console.log(formatRelativeTime(sampleData));

  return (
    <article className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm hover:border-slate-200 transition-all space-y-3 mb-4">
      {/* Header Metadata */}
      <div className="flex items-center justify-between">
        {/* <button onClick={() => { console.log("clicked");console.log(post.creator_name); setNotOwner(post.creator_name); setopenProfile(true) }}> */}
          <div className="flex items-center gap-3">

            <img
              src={post.profile_photo}
              alt={post.creator_name}
              className="w-10 h-10 rounded-full border border-slate-100 object-cover"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                {post.creator_name}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {formatRelativeTime(post.created_at)}
              </p>
            </div>
          </div>
        {/* </button> */}
        {/* {(isowner)?( */}
        {/* <button onClick={()=>setOpenEdit(true)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          ):(
            null
          )
          
        } */}
      </div>

      {/* Main Core Typography */}
      <div>
        <h2 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight leading-snug">
          {post.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-700 mt-2 whitespace-pre-wrap font-normal leading-relaxed">
          {post.content}
        </p>
        <p className="text-xs text-slate-400 font-medium mt-6">
          {/* {post.addons.length} {post.addons.length === 1 ? 'media item' : 'media items'} */}
          {/* sports */}
          {
            // console.log(post)
            post.tags.map((tag, index) => (
              <span key={index} className="inline-block bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                #{tag}
                {/* hello */}
              </span>
            ))
          }
        </p>
      </div>

      {/* Interactive Media Carousel Renderer */}
      <MediaCarousel addons={post.addons} />

      {/* Social Actions Panel */}
      <div className="flex items-center gap-6 pt-2 border-t border-slate-50 text-slate-500 text-xs sm:text-sm font-semibold">
        {/* <button className="flex items-center gap-1.5 hover:text-pink-600 transition-colors group">
          <div className="p-1.5 rounded-lg group-hover:bg-pink-50">
            <Heart className="w-4 h-4" />
          </div>
          <span>{post.likes}</span>
        </button> */}
        <button
          onClick={handleLike}
          className={`
              flex items-center gap-1.5
              transition-all group
              ${liked
              ? "text-pink-600"
              : "hover:text-pink-600"
            }
          `}
        >

          <div
            className={`
                  p-1.5 rounded-lg transition-all
                  ${liked
                ? "bg-pink-50"
                : "group-hover:bg-pink-50"
              }
              `}
          >

            <Heart
              className={`
                      w-4 h-4 transition-all duration-200
                      ${liked ? "fill-pink-600 scale-110" : ""}
                  `}
            />
          </div>

          <span>{likeCount}</span>

        </button>
        <button onClick={() => setOpenComments(true)}
          className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors group">
          <div className="p-1.5 rounded-lg group-hover:bg-indigo-50">
            <MessageSquare className="w-4 h-4" />
          </div>
          <span>{post.comment_count}</span>
        </button>
        {/* <button className="flex items-center gap-1.5 hover:text-slate-700 transition-colors group ml-auto">
          <div className="p-1.5 rounded-lg group-hover:bg-slate-100">
            <Share2 className="w-4 h-4" />
          </div>
        </button> */}
      </div>
      {/* {openEdit &&(isowner)&& (
              <UpdatePostModal
                  isOpen={openEdit}
                  onClose={() => setOpenEdit(false)}
                  post={post}
              />
            )} */}
      <PostCommentsModal
        isOpen={openComments}
        onClose={() => setOpenComments(false)}
        post={post}
      />
      {
        // (openProfile && (
        //   <ProfilePage
        //     isOwner={false} notUser={notOwner}
        //   />
        // ))
      }
    </article>
  );
}