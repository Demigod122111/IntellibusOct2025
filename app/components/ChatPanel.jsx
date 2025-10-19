"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/database";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function ChatPanel({ conversationId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [usersCache, setUsersCache] = useState({});
    const [otherMembers, setOtherMembers] = useState([]);
    const [showMembers, setShowMembers] = useState(false);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("conversation_id", conversationId)
                .order("created_at", { ascending: true });
            if (error) console.error(error);
            else {
                setMessages(data);
                fetchUsers(data);
            }
        };

        const fetchUsers = async (msgs) => {
            const senderIds = Array.from(new Set(msgs.map((m) => m.sender_id)));
            const idsToFetch = senderIds.filter((id) => !usersCache[id]);
            if (idsToFetch.length === 0) return;

            const { data: users, error } = await supabase
                .from("users")
                .select("*")
                .in("user_id", idsToFetch);

            if (error) console.error(error);
            else {
                const newCache = { ...usersCache };
                users.forEach((u) => {
                    newCache[u.user_id] = u;
                });
                setUsersCache(newCache);
            }
        };

        const fetchOtherMembers = async () => {
            const { data, error } = await supabase
                .from("conversation_members")
                .select("user_id, users(email, display_name)")
                .eq("conversation_id", conversationId)
                .neq("user_id", currentUser.id);

            if (error) console.error(error);
            else setOtherMembers(data || []);
        };

        fetchMessages();
        fetchOtherMembers();

        // Real-time subscription
        const subscription = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, [conversationId]);

    // Scroll to bottom inside the scrollable container
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }

        fetchUsers(messages);
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const { error } = await supabase.from("messages").insert([
            {
                conversation_id: conversationId,
                sender_id: currentUser.id,
                content: newMessage,
                type: "text",
            },
        ]);

        if (error) console.error(error);
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-full border-l border-gray-300 relative">
            {/* Other members dropdown */}
            <div className="absolute top-2 right-2">
                <button
                    onClick={() => setShowMembers(!showMembers)}
                    className="text-sm text-gray-500 hover:text-gray-800"
                >
                    Show Members
                </button>
                {showMembers && (
                    <div className="absolute right-0 mt-1 bg-white border rounded shadow-lg z-10 p-2 min-w-max">
                        {otherMembers.length === 0 ? (
                            <div className="text-gray-500 text-sm">No other members</div>
                        ) : (
                            otherMembers.map((m) => (
                                <div
                                    key={m.user_id}
                                    className="text-gray-700 text-sm whitespace-nowrap px-2 py-1 cursor-pointer"
                                    onClick={() => redirect(`/profile?id=${m.user_id}`)}
                                >
                                    {m.users.email} ({m.users.display_name})
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>


            {/* Messages */}
            <div
                ref={scrollContainerRef}
                className="flex-grow overflow-y-auto p-4 flex flex-col gap-3"
            >
                {messages.map((msg) => {
                    const isMine = msg.sender_id === currentUser.id;
                    const sender = usersCache[msg.sender_id] || {};
                    return (
                        <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} items-end gap-2`}>
                            {/* Avatar */}
                            {!isMine && (
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    {sender.avatar_base64 ? (
                                        <Image
                                            src={sender.avatar_base64}
                                            alt={sender.display_name}
                                            width={32}
                                            height={32}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="bg-gray-400 w-full h-full flex items-center justify-center text-white text-xs">
                                            {sender.display_name?.charAt(0).toUpperCase() || sender.email?.charAt(0).toUpperCase() || "U"}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div
                                className={`max-w-[70%] px-4 py-2 break-words rounded-lg shadow-md ${isMine
                                    ? "bg-green-800 text-white rounded-br-none"
                                    : "bg-gray-300 text-gray-900 rounded-bl-none"
                                    }`}
                            >
                                {/* Name */}
                                {!isMine && (
                                    <div className="font-semibold text-sm mb-1">{sender.display_name || sender.email || "Unknown"}</div>
                                )}

                                {/* Message content */}
                                <div>{msg.content}</div>

                                {/* Timestamp */}
                                <div className={`text-xs mt-1 ${isMine ? "text-gray-300 text-right" : "text-gray-600"}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </div>
                            </div>

                            {/* Spacer for sent messages */}
                            {isMine && <div className="w-8" />}
                        </div>
                    );
                })}
            </div>

            {/* Input */}
            <div className="flex p-2 border-t border-gray-300 gap-2">
                <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
