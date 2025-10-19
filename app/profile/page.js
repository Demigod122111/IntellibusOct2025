"use client";

import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/database";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import requestIcon from "../static_data/images/request.png";
import { toast } from "react-toastify";
import { getOrCreateConversation } from "@/lib/helpers";

function ProfileClient() {
    const router = useRouter();
    const params = useSearchParams();
    const profileId = params.get("id"); // visiting /profile?id=<uuid>
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);
    const [biddedListings, setBiddedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    const [email, setEmail] = useState(null);

    // Editable fields
    const [avatar, setAvatar] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [contact, setContact] = useState("");

    useEffect(() => {
        loadProfile();
    }, [profileId]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const {
                data: { user: currentUser },
            } = await supabase.auth.getUser();

            if (!currentUser) {
                router.push("/auth");
                return;
            }

            setIsOwner(!profileId || profileId === currentUser.id);
            const targetId = profileId || currentUser.id;

            // Fetch user info
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("user_id", targetId)
                .single();

            if (userError) throw userError;

            setUser(userData);
            setAvatar(userData.avatar_base64 || "");
            setFullName(userData.display_name || "");
            setContact(userData.contact || "");
            setEmail(userData.email);

            // Fetch user's own listings
            const { data: listingData, error: listingError } = await supabase
                .from("listings")
                .select("*")
                .eq("user_id", targetId);

            if (listingError) throw listingError;
            setListings(listingData);

            // If owner, fetch listings they’ve bidded on
            if (!profileId || profileId === currentUser.id) {
                const { data: bids, error: bidError } = await supabase
                    .from("bids")
                    .select("listing_id")
                    .eq("user_id", currentUser.id);

                if (bidError) throw bidError;

                const listingIds = bids.map((b) => b.listing_id);

                if (listingIds.length > 0) {
                    const { data: biddedData, error: biddedError } = await supabase
                        .from("listings")
                        .select("*")
                        .in("id", listingIds);

                    if (biddedError) throw biddedError;
                    setBiddedListings(biddedData);
                }
            }
        } catch (err) {
            console.error("Error loading profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            const {
                data: { user: currentUser },
            } = await supabase.auth.getUser();

            const { error: userError } = await supabase
                .from("users")
                .update({ avatar_base64: avatar, contact, display_name: fullName })
                .eq("user_id", currentUser.id);

            if (userError) throw userError;

            if (password.trim() !== "") {
                const { error: pwError } = await supabase.auth.updateUser({
                    password,
                });
                if (pwError) throw pwError;
            }

            toast.success("Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile:", err);
            toast.error("Failed to update profile.");
        }
    };

    const handleChat = async () => {
        try {
            const {
                data: { user: currentUser },
            } = await supabase.auth.getUser();

            if (!currentUser) return;

            const targetUserId = profileId || currentUser.id;

            if (targetUserId === currentUser.id) return; // don't chat with yourself

            // Use helper to get or create conversation
            const conversationId = await getOrCreateConversation(currentUser.id, targetUserId);
            if (!conversationId) throw new Error("Failed to start conversation");

            // Redirect to chat page
            toast.success("Chat Connection Established");
            router.push(`/chat?conversation_id=${conversationId}`);
        } catch (err) {
            console.error(err);
            toast.error("Could not start chat.");
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-700">
                User not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow px-4 md:px-10 py-10 mt-[5%]">
                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                        <div className="relative">
                            {avatar ? (
                                <Image
                                    src={avatar}
                                    alt="Profile"
                                    width={120}
                                    height={120}
                                    className="rounded-full border-4 border-green-600 object-cover"
                                />
                            ) : (
                                <div className="w-[120px] h-[120px] bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl">
                                    {fullName?.charAt(0) || email?.charAt(0) || "U"}
                                </div>
                            )}
                            {isOwner && (
                                <label className="absolute bottom-0 right-0 bg-green-700 text-white text-xs px-2 py-1 rounded cursor-pointer">
                                    Edit
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarUpload}
                                    />
                                </label>
                            )}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-green-800">
                                {fullName || user.email}
                            </h1>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-600">{contact}</p>
                        </div>

                        {!isOwner && (
                            <button
                                onClick={handleChat}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold mt-2"
                            >
                                Chat
                            </button>
                        )}

                    </div>

                    {/* Editable Section */}
                    {isOwner && (
                        <div className="mb-8 space-y-4">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Full Name"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                            />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password (leave blank to keep current)"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                            />
                            <input
                                type="tel"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Phone Number: +1 (876) 888-8888"
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                            />
                            <button
                                onClick={handleSave}
                                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-lg font-semibold"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}

                    {/* Own Listings */}
                    <h2 className="text-xl font-semibold text-green-800 mb-4">
                        {isOwner ? "Your Listings" : `${fullName || "User"}'s Listings`}
                    </h2>

                    {listings.length === 0 ? (
                        <p className="text-gray-700">No listings available.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                            {listings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="bg-white rounded-lg shadow p-4 border border-green-100 cursor-pointer"
                                    onClick={() => router.push(`/catalog/view?id=${listing.id}`)}
                                >
                                    {listing.type === "consumer" || listing.icon_base64 ? (
                                        <Image
                                            src={listing.type === "consumer" ? requestIcon : listing.icon_base64}
                                            alt={listing.title}
                                            width={64}
                                            height={64}
                                            className="w-64 h-64 object-cover rounded-md mb-2"
                                        />
                                    ) : (
                                        <div className="w-64 h-64 bg-green-100 flex items-center justify-center text-green-600 rounded-md mb-2">
                                            No Image
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-green-800 text-center mb-1">
                                        {listing.title}
                                    </h3>
                                    <p className="text-gray-700 text-center">
                                        JMD {listing.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Bidded Listings (only for owner) */}
                    {isOwner && (
                        <>
                            <h2 className="text-xl mt-[5%] font-semibold text-green-800 mb-4">
                                Listings You’ve Bidded On
                            </h2>

                            {biddedListings.length === 0 ? (
                                <p className="text-gray-700">You haven’t placed any bids yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {biddedListings.map((listing) => (
                                        <div
                                            key={listing.id}
                                            className="bg-white rounded-lg shadow p-4 border border-green-100 cursor-pointer"
                                            onClick={() => router.push(`/catalog/view?id=${listing.id}`)}
                                        >
                                            {listing.type === "consumer" || listing.icon_base64 ? (
                                                <Image
                                                    src={listing.type === "consumer" ? requestIcon : listing.icon_base64}
                                                    alt={listing.title}
                                                    width={64}
                                                    height={64}
                                                    className="w-64 h-64 object-cover rounded-md mb-2"
                                                />
                                            ) : (
                                                <div className="w-64 h-64 bg-green-100 flex items-center justify-center text-green-600 rounded-md mb-2">
                                                    No Image
                                                </div>
                                            )}
                                            <h3 className="font-semibold text-green-800 text-center mb-1">
                                                {listing.title}
                                            </h3>
                                            <p className="text-gray-700 text-center">
                                                JMD {listing.price}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<p className="text-center mt-10">Loading profile...</p>}>
            <ProfileClient />
        </Suspense>
    );
}