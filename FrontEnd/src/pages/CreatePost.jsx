import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { postService } from "../services/postServices";
import {
    X,
    ImagePlus,
    Video,
    Loader2,
} from "lucide-react";

export default function CreatePostModal({
    isOpen,
    onClose,
}) {
    // console.log("hi there");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");

    const [addons, setAddons] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    if (!isOpen) return null;

    // =========================================
    // FILE CHANGE
    // =========================================

    const handleFileChange = (e) => {

        const files = Array.from(e.target.files);

        if (addons.length + files.length > 10) {

            alert("Maximum 10 files allowed");

            return;
        }

        setAddons(prev => [...prev, ...files]);

        const previews = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            type: file.type,
        }));

        setPreviewFiles(prev => [...prev, ...previews]);
    };

    // =========================================
    // REMOVE FILE
    // =========================================

    const removeFile = (index) => {

        setAddons(prev =>
            prev.filter((_, i) => i !== index)
        );

        setPreviewFiles(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!title.trim()) {
            alert("Title is required");
            return;
        }

        if (!content.trim()) {
            alert("Content is required");
            return;
        }

        if (!tags.trim()) {
            alert("At least one tag is required");
            return;
        }

        try {

            setLoading(true);

            // =====================================
            // TAG ARRAY
            // =====================================

            // const tagArray = tags
            //     .split(",")
            //     .map(tag => tag.trim())
            //     .filter(tag => tag.length > 0);

            // =====================================
            // IMAGEKIT UPLOAD LOGIC HERE
            // =====================================

            // upload addons to imagekit
            // get urls

            // =====================================
            // FINAL DATA
            // =====================================

            // const postData = {
            //     title,
            //     content,
            //     tags,
            //     addons,
            // };

            // console.log(postData);
            const formDataToSend = new FormData();
            formDataToSend.append('title', title);
            formDataToSend.append('content', content);
            // setTags(tags.slice(1,-1));
            formDataToSend.append('tags', JSON.stringify(tags));
            addons.forEach((file) => {
                formDataToSend.append('addons', file);
            });

            // await axios.post(...)
            const data=await postService.create_post(formDataToSend);
            console.log(data);
            // for (let pair of formDataToSend.entries()) {
            //     console.log(pair[0], pair[1]);
            // }
            onClose();
            // window.location.reload();
            // =====================================
            // CLEAR FORM
            // =====================================

            setTitle("");
            setContent("");
            setTags("");
            setAddons([]);
            setPreviewFiles([]);
            navigate("/");
        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        const loadContent = async () => {
          try {
            // setIsLoading(true);
            await postService.chk_token();
            // const user = await postService.user_info();
            
            // State updates are batched together
            // setProfile(user.user);
            // setNoOfPosts(user.no_of_posts);
            // setNoOfCreatedCommunities(user.no_of_created_comm);
            // setNoOfJoinedCommunities(user.no_of_join_comm);
          } catch (err) {
            console.error("Error fetching profile data:", err.message);
            navigate("/login");
          } finally {
            // setIsLoading(false);
          }
        };
        loadContent();
      }, [navigate]);

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            {/* MODAL */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">

                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Create Post
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                            Share something with the world
                        </p>
                    </div>

                    <button
                        onClick={
                            ()=>{
                                onclose;
                                navigate("/");
                            }
                        }
                        className="
                            p-2 rounded-xl
                            hover:bg-slate-100
                            transition-all
                        "
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="p-4 space-y-4 max-h-[85vh] overflow-y-auto"
                >

                    {/* TITLE */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Title *
                        </label>

                        <input
                            type="text"
                            placeholder="Enter post title..."
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            className="
                                w-full px-3 py-2.5
                                rounded-2xl
                                border border-slate-200
                                focus:border-indigo-500
                                focus:ring-4
                                focus:ring-indigo-100
                                outline-none
                                transition-all
                            "
                        />
                    </div>

                    {/* CONTENT */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Content *
                        </label>

                        <textarea
                            rows={5}
                            placeholder="Write your post..."
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            className="
                                w-full px-3 py-2.5
                                rounded-2xl
                                border border-slate-200
                                focus:border-indigo-500
                                focus:ring-4
                                focus:ring-indigo-100
                                outline-none
                                resize-none
                                transition-all
                            "
                        />
                    </div>

                    {/* TAGS */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Tags *
                        </label>

                        <input
                            type="text"
                            placeholder="react, coding, backend"
                            value={tags}
                            onChange={(e) =>
                                setTags(e.target.value)
                            }
                            className="
                                w-full px-3 py-2.5
                                rounded-2xl
                                border border-slate-200
                                focus:border-indigo-500
                                focus:ring-4
                                focus:ring-indigo-100
                                outline-none
                                transition-all
                            "
                        />

                        <p className="text-xs text-slate-400 mt-2">
                            Separate tags using commas
                        </p>
                    </div>

                    {/* ADDONS */}
                    <div>

                        <div className="flex items-center justify-between mb-2">

                            <label className="text-sm font-semibold text-slate-700">
                                Addons
                            </label>

                            <span className="text-xs text-slate-400">
                                {addons.length}/10
                            </span>
                        </div>

                        <label
                            className="
                                flex flex-col items-center justify-center
                                w-full h-28
                                border-2 border-dashed border-slate-200
                                rounded-2xl
                                cursor-pointer
                                hover:border-indigo-400
                                hover:bg-indigo-50/40
                                transition-all
                            "
                        >

                            <div className="flex items-center gap-2 text-slate-500">
                                <ImagePlus className="w-5 h-5" />
                                <Video className="w-5 h-5" />
                            </div>

                            <p className="text-sm font-medium text-slate-600 mt-2">
                                Upload images or videos
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                                Maximum 10 files
                            </p>

                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {/* PREVIEW */}
                    {
                        previewFiles.length > 0 && (

                            <div className="grid grid-cols-2 gap-3">

                                {
                                    previewFiles.map((item, index) => (

                                        <div
                                            key={index}
                                            className="relative rounded-2xl overflow-hidden border border-slate-200"
                                        >

                                            {
                                                item.type.startsWith("image")
                                                    ? (
                                                        <img
                                                            src={item.url}
                                                            alt=""
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    )
                                                    : (
                                                        <video
                                                            src={item.url}
                                                            className="w-full h-32 object-cover"
                                                            controls
                                                        />
                                                    )
                                            }

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFile(index)
                                                }
                                                className="
                                                    absolute top-2 right-2
                                                    w-7 h-7
                                                    rounded-full
                                                    bg-black/70
                                                    text-white
                                                    flex items-center justify-center
                                                    hover:bg-red-500
                                                    transition-all
                                                "
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }

                    {/* FOOTER */}
                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={()=>{navigate('/')}}
                            className="
                                px-4 py-2.5 rounded-2xl
                                border border-slate-200
                                text-slate-700
                                font-semibold
                                hover:bg-slate-100
                                transition-all
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                px-5 py-2.5 rounded-2xl
                                bg-indigo-600
                                text-white
                                font-semibold
                                hover:bg-indigo-700
                                transition-all
                                flex items-center gap-2
                            "
                        >
                            {
                                loading
                                    ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Posting...
                                        </>
                                    )
                                    : "Create Post"
                            }
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}