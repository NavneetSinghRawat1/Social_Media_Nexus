import React, { useEffect, useState } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import {postService} from "../services/postServices";
export default function EditProfileModal({
    isOpen,
    onClose,
    user,
}) {

    const [bio, setBio] = useState(user?.bio || "");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    const [preview, setPreview] = useState(
        user?.picture||""
    );
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const useLoaderData=()=>{
            // console.log(user);
            setBio(user?.bio);
            setPreview(user?.picture);
        };
        useLoaderData();
    },[]);
    
    if (!isOpen) return null;
    

    const handleImageChange = (e) => {
        // console.log("ajsn ajsbk");
        // const file = e.target.files[0];

        // if (!file) return;
        // setFile(file);
        // const formdata = new FormData();
        // formdata.append('profile_photo', file);
        // console.log("hasjh -> ",file);
        // // console.log("aysyj -> ",formdata);
        // setFormData(formdata);
        // // console.log("formData -> ",formData);
        // setProfilePic(file);

        // setPreview(URL.createObjectURL(file));
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            // =========================
            // IMAGEKIT UPLOAD HERE
            // =========================

            // let uploadedImageUrl = user.picture;

            // if(profilePic){
            //    upload to imagekit
            //    uploadedImageUrl = returned_url;
            // }

            // const updatedData = {
            //     bio,
            //     u_password:password,
            //     // profile_photo: uploadedImageUrl,
            // };
            // const updatedData = new FormData();
            // updatedData.append('bio', bio);
            // updatedData.append('u_password', password);
            // if(file){
            //     updatedData.append('profile_photo', file);
            // }
            // // if(formData){
            // //     updatedData.profile_photo=file;
            // // }
            // // console.log(file);
            // for (let pair of updatedData.entries()) {
            //     console.log(pair[0] + ': ' + pair[1]);
            // }
            const updatedData = new FormData();

            updatedData.append("bio", bio);
            updatedData.append("u_password", password);

            if (file) {
                updatedData.append("profile_photo", file);
            }

            for (let pair of updatedData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // console.log("tttttt -> ",updatedData);

            // await axios.put("/api/profile/update", updatedData)
            const data=await postService.user_update(updatedData);
            console.log(data);
            onClose();
            window.location.reload();
        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    
    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

            {/* Modal */}
            {/* <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"> */}
            {/* <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"> */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Header */}
                {/* <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100"> */}
                <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-100">
                

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            Edit Profile
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Update your account details
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

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    // className="p-6 space-y-6"
                    className="p-4 space-y-4"
                >

                    {/* Profile Picture */}
                    <div className="flex flex-col items-center">

                        <div className="relative">

                            <img
                                src={
                                    preview||"https://placehold.co/200x200"
                                }
                                alt="profile"
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
                                    w-10 h-10 rounded-full
                                    bg-indigo-600
                                    flex items-center justify-center
                                    cursor-pointer
                                    hover:bg-indigo-700
                                    transition-all
                                    shadow-lg
                                "
                            >
                                <Camera className="w-5 h-5 text-white" />

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>

                        <p className="text-xs text-slate-500 mt-3">
                            Upload new profile picture
                        </p>
                    </div>

                    {/* Username */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            value={user?.username || ""}
                            disabled
                            className="
                                w-full px-3 py-2.5
                                rounded-2xl
                                border border-slate-200
                                bg-slate-100
                                text-slate-500
                                outline-none
                                cursor-not-allowed
                            "
                        />
                    </div>

                    {/* Bio */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Bio
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Tell something about yourself..."
                            value={bio??""}
                            onChange={(e) =>
                                setBio(e.target.value)
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

                    {/* Password */}
                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
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

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                px-5 py-3 rounded-2xl
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
                                px-6 py-3 rounded-2xl
                                bg-indigo-600
                                text-white
                                font-semibold
                                hover:bg-indigo-700
                                transition-all
                                flex items-center gap-2
                                shadow-lg shadow-indigo-200
                            "
                        >
                            {
                                loading
                                    ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    )
                                    : "Save Changes"
                            }
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}