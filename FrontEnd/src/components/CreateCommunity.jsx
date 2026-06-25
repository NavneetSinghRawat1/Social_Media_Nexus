import React, { useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { postService } from "../services/postServices";
import {
    X,
    Camera,
    Loader2,
} from "lucide-react";

export default function CreateCommunityModal({
    isOpen,
    onClose,
}) {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");

    const [tags, setTags] = useState("");

    const [communityPic, setCommunityPic] =
        useState(null);

    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;


    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setCommunityPic(file);

        setPreview(
            URL.createObjectURL(file)
        );
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!name.trim()) {
            alert("Community name is required");
            return;
        }

        if (!description.trim()) {
            alert("Description is required");
            return;
        }

        if (!tags.trim()) {
            alert("At least one tag is required");
            return;
        }

        try {

            setLoading(true);


            // const tagArray = tags
            //     .split(",")
            //     .map(tag => tag.trim())
            //     .filter(tag => tag.length > 0);




            // const communityData = {

            //     name,

            //     description,

            //     tags: tagArray,

            //     communityPic,
            // };
            const communityData = new FormData();
            communityData.append('name', name);
            communityData.append('description', description);
            communityData.append('tags', tags);
            if(communityPic)
            communityData.append('communityPic', communityPic);

            console.log(communityData);

            // await axios.post(...)
            const data=await postService.create_community(communityData);
            console.log(data);

            setName("");
            setDescription("");
            setTags("");
            setCommunityPic(null);
            setPreview("");

            onClose();

            navigate(`/`);
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

            
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

                
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">

                    <div>

                        <h2 className="text-lg font-bold text-slate-800">
                            Create Community
                        </h2>

                        <p className="text-xs text-slate-500 mt-1">
                            Build your own public community
                        </p>
                    </div>

                    <button
                        onClick={()=>{navigate("/")}}
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
                    className="
                        p-4 space-y-4
                        max-h-[85vh]
                        overflow-y-auto
                    "
                >

                    
                    <div className="flex flex-col items-center">

                        <div className="relative">

                            <img
                                src={
                                    preview ||
                                    "https://placehold.co/200x200"
                                }
                                alt="community"
                                className="
                                    w-20 h-20 rounded-full
                                    object-cover
                                    border-4 border-slate-100
                                    shadow-md
                                "
                            />

                            <label
                                className="
                                    absolute bottom-0 right-0
                                    w-8 h-8 rounded-full
                                    bg-indigo-600
                                    flex items-center justify-center
                                    cursor-pointer
                                    hover:bg-indigo-700
                                    transition-all
                                    shadow-lg
                                "
                            >
                                <Camera className="w-4 h-4 text-white" />

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        <p className="text-xs text-slate-500 mt-3">
                            Upload community picture
                        </p>
                    </div>

                    
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Community Name *
                        </label>

                        <input
                            type="text"
                            placeholder="Enter community name..."
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
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
                            Description *
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Describe your community..."
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
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

                    
                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={()=>{
                                navigate("/");
                            }}
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
                                            Creating...
                                        </>
                                    )
                                    : "Create Community"
                            }
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}