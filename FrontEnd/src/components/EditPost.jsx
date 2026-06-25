import React, { useState } from "react";
import {
    X,
    ImagePlus,
    Video,
    Loader2,
    Trash2,
    AlertTriangle,
} from "lucide-react";

export default function UpdatePostModal({
    isOpen,
    onClose,
    post,
}) {
    console.log("i am called");

    const [title, setTitle] = useState(
        post?.title || ""
    );

    const [content, setContent] = useState(
        post?.content || ""
    );

    const [tags, setTags] = useState(
        post?.tags?.join(", ") || ""
    );

    const [existingAddons, setExistingAddons] =
        useState(post?.addons || []);

    const [newFiles, setNewFiles] = useState([]);

    const [previewFiles, setPreviewFiles] =
        useState([]);

    const [loading, setLoading] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] =
        useState(false);

    if (!isOpen || !post) return null;


    const isVideo = (url) => {

        return /\.(mp4|webm|ogg|mov)$/i.test(url);
    };


    const handleFileChange = (e) => {

        const files = Array.from(e.target.files);

        const totalFiles =
            existingAddons.length +
            newFiles.length +
            files.length;

        if (totalFiles > 10) {

            alert("Maximum 10 addons allowed");

            return;
        }

        setNewFiles(prev => [...prev, ...files]);

        const previews = files.map(file => ({
            file,
            url: URL.createObjectURL(file),
            type: file.type,
        }));

        setPreviewFiles(prev => [
            ...prev,
            ...previews,
        ]);
    };


    const removeExistingAddon = (index) => {

        setExistingAddons(prev =>
            prev.filter((_, i) => i !== index)
        );
    };


    const removeNewFile = (index) => {

        setNewFiles(prev =>
            prev.filter((_, i) => i !== index)
        );

        setPreviewFiles(prev =>
            prev.filter((_, i) => i !== index)
        );
    };

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

        try {

            setLoading(true);


            const tagArray = tags
                .split(",")
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);



            const updatedPost = {

                title,

                content,

                tags: tagArray,

                existingAddons,

                newFiles,
            };

            console.log(updatedPost);


            onClose();

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };


    const handleDeletePost = async () => {

        try {

            setLoading(true);

            console.log("Delete Post:", post.post_id);


            onClose();

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">

                    <div>

                        <h2 className="text-lg font-bold text-slate-800">
                            Update Post
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                            Edit your post details
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="
                            p-2 rounded-xl
                            hover:bg-slate-100
                            transition-all
                        "
                    >
                        <X className="w-5 h-5 text-slate-600" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-4 space-y-4 max-h-[85vh] overflow-y-auto"
                >

                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Title *
                        </label>

                        <input
                            type="text"
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

                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Content *
                        </label>

                        <textarea
                            rows={5}
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

                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Tags
                        </label>

                        <input
                            type="text"
                            value={tags}
                            onChange={(e) =>
                                setTags(e.target.value)
                            }
                            placeholder="react, coding"
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

                    <div>

                        <div className="flex items-center justify-between mb-2">

                            <label className="text-sm font-semibold text-slate-700">
                                Addons
                            </label>

                            <span className="text-xs text-slate-400">
                                {
                                    existingAddons.length +
                                    newFiles.length
                                }/10
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
                                Add images or videos
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

                    {
                        existingAddons.length > 0 && (

                            <div className="grid grid-cols-2 gap-3">

                                {
                                    existingAddons.map((url, index) => (

                                        <div
                                            key={index}
                                            className="relative rounded-2xl overflow-hidden border border-slate-200"
                                        >

                                            {
                                                isVideo(url)
                                                    ? (
                                                        <video
                                                            src={url}
                                                            controls
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    )
                                                    : (
                                                        <img
                                                            src={url}
                                                            alt=""
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    )
                                            }

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExistingAddon(index)
                                                }
                                                className="
                                                    absolute top-2 right-2
                                                    w-7 h-7 rounded-full
                                                    bg-black/70 text-white
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
                                                item.type.startsWith("video")
                                                    ? (
                                                        <video
                                                            src={item.url}
                                                            controls
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    )
                                                    : (
                                                        <img
                                                            src={item.url}
                                                            alt=""
                                                            className="w-full h-32 object-cover"
                                                        />
                                                    )
                                            }

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewFile(index)
                                                }
                                                className="
                                                    absolute top-2 right-2
                                                    w-7 h-7 rounded-full
                                                    bg-black/70 text-white
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
                    <div className="flex flex-col gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() =>
                                setShowDeleteConfirm(true)
                            }
                            className="
                                w-full px-4 py-2.5 rounded-2xl
                                border border-red-200
                                bg-red-50
                                text-red-600
                                font-semibold
                                hover:bg-red-100
                                transition-all
                                flex items-center justify-center gap-2
                            "
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Post
                        </button>

                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={onClose}
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
                                                Updating...
                                            </>
                                        )
                                        : "Save Changes"
                                }
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {
                showDeleteConfirm && (

                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">

                        <div className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl">

                            <div className="flex items-center gap-3">

                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">

                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>

                                <div>

                                    <h3 className="font-bold text-slate-800">
                                        Delete Post
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-1">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">

                                <button
                                    onClick={() =>
                                        setShowDeleteConfirm(false)
                                    }
                                    className="
                                        px-4 py-2 rounded-xl
                                        border border-slate-200
                                        hover:bg-slate-100
                                        transition-all
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleDeletePost}
                                    className="
                                        px-4 py-2 rounded-xl
                                        bg-red-500
                                        text-white
                                        hover:bg-red-600
                                        transition-all
                                    "
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}