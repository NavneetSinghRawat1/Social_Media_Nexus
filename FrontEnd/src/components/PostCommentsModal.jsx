import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageSquare,
  X,
  Send,
} from "lucide-react";

import MediaCarousel from "./MediaCarousel";
import { postService } from "../services/postServices";
import { useNavigate } from "react-router-dom";

export default function PostCommentsModal({
  isOpen,
  onClose,
  post,
}) {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(
        post.isliked || false
    );
  const [likeCount, setLikeCount] = useState(
        post.likes || 0
    );
  
  function formatRelativeTime(dateString) {
    const inputDate = new Date(dateString);
    const now = new Date();

    const deltaSeconds = Math.round(
      (inputDate - now) / 1000
    );

    const units = [
      { name: "year", seconds: 31536000 },
      { name: "month", seconds: 2592000 },
      { name: "week", seconds: 604800 },
      { name: "day", seconds: 86400 },
      { name: "hour", seconds: 3600 },
      { name: "minute", seconds: 60 },
      { name: "second", seconds: 1 },
    ];

    for (const unit of units) {
      if (
        Math.abs(deltaSeconds) >= unit.seconds ||
        unit.name === "second"
      ) {
        const value = Math.round(
          deltaSeconds / unit.seconds
        );

        const rtf = new Intl.RelativeTimeFormat(
          "en",
          { numeric: "auto" }
        );

        return rtf.format(value, unit.name);
      }
    }
  }

  // =========================================
  // FETCH COMMENTS
  // =========================================

  const fetchComments = async () => {
    try {
      setLoading(true);

      // Example API call
      const data = await postService.get_comments(
        post.post_id
      );

      console.log("comments -> ", data);
      // let x=Object.values(data);
      setComments(data || []);
      console.log("hello -> ",comments);
    } catch (err) {
      console.log(err);
      navigate('/login');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

  // =========================================
  // ADD COMMENT
  // =========================================

  if (!isOpen) return null;
  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    try {
      const formData = new FormData();

      formData.append("post_id", post.post_id);
      formData.append("comment", commentText);

      const data = await postService.add_comment(
        formData
      );

      console.log(data);

      // Optimistic update
      setComments((prev) => [
        data[0],
        ...prev,
      ]);

      setCommentText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3">
      <div className="bg-white w-full max-w-3xl h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            Post & Comments
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto">

          {/* COMPLETE POST */}
          <div className="p-5 border-b border-slate-100">

            {/* USER */}
            <div className="flex items-center gap-3">
              <img
                src={post.profile_photo}
                alt={post.creator_name}
                className="w-11 h-11 rounded-full object-cover"
              />

              <div>
                <h3 className="font-bold text-slate-800">
                  {post.creator_name}
                </h3>

                <p className="text-xs text-slate-400">
                  {formatRelativeTime(post.created_at)}
                </p>
              </div>
            </div>

            {/* CONTENT */}
            <div className="mt-4">
              <h2 className="text-xl font-bold text-slate-900">
                {post.title}
              </h2>

              <p className="mt-3 text-slate-700 whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* TAGS */}
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* MEDIA */}
            <div className="mt-4">
              <MediaCarousel addons={post.addons} />
            </div>

            {/* STATS */}
            <div className="flex items-center gap-5 mt-5 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                {/* <Heart className="w-4 h-4" />
                {post.isliked} */}
                {console.log("liked -> ",liked)}
                <Heart
                    className={`
                        w-4 h-4 transition-all duration-200
                        ${liked ? "fill-pink-600 scale-110" : ""}
                    `}
                />
                <span>{likeCount}</span>
              </div>

              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {comments.length}
              </div>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="p-5 space-y-5">

            <h3 className="font-bold text-slate-800 text-lg">
              Comments
            </h3>

            {loading ? (
              <p className="text-slate-500">
                Loading comments...
              </p>
            ) : comments.length === 0 ? (
              <p className="text-slate-400">
                No comments yet
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex gap-3"
                >
                  <img
                    src={comment.profile_photo}
                    alt={comment.writer_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-slate-800">
                          {comment.writer_name}
                        </h4>

                        <span className="text-xs text-slate-400">
                          {formatRelativeTime(
                            comment.created_at
                          )}
                        </span>
                      </div>

                      <p className="text-sm text-slate-700 mt-1 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COMMENT INPUT */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">

            <textarea
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              placeholder="Write a comment..."
              rows={1}
              className="flex-1 resize-none border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <button
              onClick={handleCommentSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-2xl transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}