// components/CommunityChat.jsx

import React, { useEffect, useRef, useState, useContext } from "react";
import { Send, Users } from "lucide-react";
import { communityService } from "../services/communityService";
import { UserDataContext } from "./contaxt/userContaxt";
import {postService} from '../services/postServices';

export default function CommunityChat({ community }) {

    const { userInfo } = useContext(UserDataContext);

    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [loading, setLoading] = useState(true);

    const bottomRef = useRef(null);

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);

                // Load messages
                const messageData =
                    await postService.getMessages(
                        community.community_id
                    );
                // console.log("sh -> ", messageData);
                if(messageData===undefined) 
                setMessages([]);
                else{
                    setMessages(messageData);
                }
                // console.log("community -> ",community.community_id);
                const joinedData =
                    await postService.isJoined(
                        community.community_id
                    );
                console.log("joined -> ",joinedData);
                setIsJoined(joinedData.joined);

            } catch (err) {

                console.log(err);

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, [community]);

    useEffect(() => {

        const interval = setInterval(async () => {

            try {

                const data =
                    await postService.getMessages(
                        community.community_id
                    );
                if(data===undefined) 
                setMessages([]);
                else
                setMessages(data);

            } catch (err) {

                console.log(err);
            }

        }, 5000);

        return () => clearInterval(interval);

    }, [community]);

    useEffect(() => {

        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    const handleSend = async () => {

        if (!messageInput.trim()) return;

        try {

            await postService.sendMessage(
                community.community_id,
                messageInput
            );

            setMessageInput("");

            const data =
                await postService.getMessages(
                    community.community_id
                );

            setMessages(data);

        } catch (err) {

            console.log(err);
        }
    };

    const handleJoin = async () => {

        try {

            await postService.joinCommunity(
                community.name
            );

            setIsJoined(true);

        } catch (err) {

            console.log(err);
        }
    };

    const handleLeave = async () => {

        try {

            await postService.leaveCommunity(
                community.name
            );

            setIsJoined(false);

        } catch (err) {

            console.log(err);
        }
    };

    if (!community) {
        return (
            <div className="text-center text-slate-500">
                No community selected
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[85vh] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">

            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">

                <div className="flex items-center gap-3">

                    <img
                        src={community.comm_pic}
                        alt={community.name}
                        className="w-12 h-12 rounded-full object-cover border"
                    />

                    <div>

                        <h2 className="font-bold text-slate-800 text-lg">
                            {community.name}
                        </h2>

                        <div className="flex items-center gap-1 text-slate-500 text-sm">

                            <Users className="w-4 h-4" />

                            <span>
                                {community.total_members || 0} members
                            </span>

                        </div>

                    </div>

                </div>

                {
                    isJoined ? (
                        <button
                            onClick={handleLeave}
                            className="px-4 py-2 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition"
                        >
                            Leave
                        </button>
                    ) : (
                        <button
                            onClick={handleJoin}
                            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                        >
                            Join
                        </button>
                    )
                }

            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-3 no-scrollbar">

                {
                    loading ? (

                        <div className="text-center text-slate-400 mt-10">
                            Loading messages...
                        </div>

                    ) : messages.length === 0 ? (

                        <div className="text-center text-slate-400 mt-10">
                            No messages yet
                        </div>

                    ) : (

                        messages.map((msg) => {

                            const isMine =
                                msg.username === userInfo.username;

                            return (

                                <div
                                    key={msg.message_id}
                                    className={`flex ${isMine
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                >

                                    <div
                                        className={`
                                            max-w-[75%]
                                            px-4
                                            py-2
                                            rounded-2xl
                                            shadow-sm
                                            ${isMine
                                                ? "bg-indigo-600 text-white rounded-br-md"
                                                : "bg-white text-slate-800 rounded-bl-md"
                                            }
                                        `}
                                    >

                                        <div
                                            className={`text-xs font-bold mb-1 ${isMine
                                                    ? "text-indigo-100"
                                                    : "text-indigo-600"
                                                }`}
                                        >
                                            {msg.username}
                                        </div>

                                        <div className="text-sm break-words">
                                            {msg.message}
                                        </div>

                                        <div
                                            className={`text-[10px] mt-1 text-right ${isMine
                                                    ? "text-indigo-200"
                                                    : "text-slate-400"
                                                }`}
                                        >
                                            {
                                                new Date(
                                                    msg.created_at
                                                ).toLocaleTimeString(
                                                    [],
                                                    {
                                                        hour: "2-digit",
                                                        minute: "2-digit"
                                                    }
                                                )
                                            }
                                        </div>

                                    </div>

                                </div>
                            );
                        })
                    )
                }

                <div ref={bottomRef}></div>

            </div>

            <div className="border-t border-slate-100 bg-white p-3">

                <div className="flex items-center gap-2">

                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) =>
                            setMessageInput(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder={
                            isJoined
                                ? "Type a message..."
                                : "Join community to send messages"
                        }
                        disabled={!isJoined}
                        className="
                            flex-1
                            border
                            border-slate-200
                            rounded-xl
                            px-4
                            py-3
                            outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                            disabled:bg-slate-100
                            disabled:cursor-not-allowed
                        "
                    />

                    <button
                        onClick={handleSend}
                        disabled={!isJoined}
                        className="
                            p-3
                            rounded-xl
                            bg-indigo-600
                            text-white
                            hover:bg-indigo-700
                            transition
                            disabled:bg-slate-300
                            disabled:cursor-not-allowed
                        "
                    >
                        <Send className="w-5 h-5" />
                    </button>

                </div>

            </div>

        </div>
    );
}