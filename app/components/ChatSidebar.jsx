"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/database";

export default function ChatSidebar({ currentUser, onSelectConversation, selectedConversation }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchConversations = async () => {
            // Get all conversation IDs the current user belongs to
            const { data: convMembers, error } = await supabase
                .from("conversation_members")
                .select("conversation_id, conversations(id, created_at)")
                .eq("user_id", currentUser.id);

            if (error) return console.error(error);

            // For each conversation, fetch other users
            const convsWithUsers = await Promise.all(
                convMembers.map(async (c) => {
                    const { data: otherMembers, error: err } = await supabase
                        .from("conversation_members")
                        .select("user_id, users(display_name)")
                        .eq("conversation_id", c.conversation_id)

                    if (err) console.error(err);

                    // Join all other usernames with commas
                    const otherUsernames =
                        otherMembers?.filter((m) => m.user_id != currentUser.id).map((m) => m.users.display_name).join(", ") ||
                        "No Other Users";

                    return {
                        ...c,
                        otherUser: otherUsernames,
                    };
                })
            );

            setConversations(convsWithUsers);
        };

        fetchConversations();

        // -------------------------------
        // Real-time listener for new messages
        // -------------------------------
        const subscription = supabase
            .channel(`user:${currentUser.id}:messages`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    // Only messages in conversations where the user is a member
                    filter: `conversation_id=in.(SELECT conversation_id FROM conversation_members WHERE user_id='${currentUser.id}')`,
                },
                (payload) => {
                    // Refresh conversations list when a new message arrives
                    fetchConversations();
                }
            )
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, [currentUser]);

    return (
        <div className="w-64 bg-white border-r p-2 flex flex-col h-full">
            <h2 className="font-bold mb-2">Chats</h2>
            <div className="flex-grow overflow-y-auto space-y-2">
                {conversations.length == 0 ? <div className="w-full flex items-center justify-center text-gray-700">
                    Nothing to see here!
                </div> : conversations.map((c) => (
                    <div
                        key={c.conversation_id}
                        className="p-2 bg-gray-200 hover:bg-gray-400 rounded cursor-pointer"
                        onClick={() =>
                            onSelectConversation(
                                selectedConversation !== c.conversation_id
                                    ? c.conversation_id
                                    : null
                            )
                        }
                    >
                        {c.otherUser}
                    </div>
                ))}
            </div>
        </div>
    );
}
