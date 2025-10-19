"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/database";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import ChatPanel from "../components/ChatPanel";
import ChatSidebar from "../components/ChatSidebar";
import { useSearchParams, useRouter } from "next/navigation";

function ChatClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [currentUser, setCurrentUser] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);

    // Load current user
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
        };
        fetchUser();
    }, []);

    // If URL has conversation_id, try to select it
    useEffect(() => {
        const conversationId = searchParams.get("conversation_id");
        if (!conversationId || !currentUser) return;

        // Verify the current user is part of this conversation
        const verifyAccess = async () => {
            const { data: members, error } = await supabase
                .from("conversation_members")
                .select("user_id")
                .eq("conversation_id", conversationId);

            if (error) {
                console.error(error);
                return;
            }

            if (members.some((m) => m.user_id === currentUser.id)) {
                setSelectedConversation(conversationId);
            } else {
                // Unauthorized access
                router.replace("/chat");
            }
        };

        verifyAccess();
    }, [searchParams, currentUser, router]);

    // Update URL whenever a conversation is selected
    const handleSelectConversation = (conversationId) => {
        setSelectedConversation(conversationId);
        router.replace(`/chat?conversation_id=${conversationId}`, { shallow: true });
    };

    if (!currentUser) return <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading user...
    </div>;

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow px-4 md:px-10 py-10 mt-[5%]">
                <div className="flex h-[80vh]">
                    <ChatSidebar
                        currentUser={currentUser}
                        onSelectConversation={handleSelectConversation}
                        selectedConversation={selectedConversation}
                    />
                    <div className="flex-grow flex flex-col">
                        {selectedConversation ? (
                            <ChatPanel conversationId={selectedConversation} currentUser={currentUser} />
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-gray-500">
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={<p className="text-center mt-10">Loading chats...</p>}>
            <ChatClient />
        </Suspense>
    );
}