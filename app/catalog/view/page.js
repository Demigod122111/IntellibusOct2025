"use client";

import { useState, useEffect, Suspense } from "react";
import { redirect, useSearchParams } from "next/navigation";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { supabase } from "@/lib/database";
import Image from "next/image";

import requestIcon from "../../static_data/images/request.png";
import { toast } from "react-toastify";

function ViewClient() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalImage, setModalImage] = useState(null);
    const [showCounterModal, setShowCounterModal] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [existingBid, setExistingBid] = useState(null);
    const [allBids, setAllBids] = useState([]);

    useEffect(() => {
        // Fetch current user session
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setCurrentUser(session.user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (id) fetchListing(id);
    }, [id]);

    useEffect(() => {
        if (listing && currentUser) {
            fetchExistingBid();
            if (listing.user_id === currentUser.id) fetchAllBids();
        }
    }, [listing, currentUser]);

    const fetchListing = async (listingId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("listings")
                .select("*")
                .eq("id", listingId)
                .single();
            if (error) throw error;
            setListing(data);
        } catch (err) {
            console.error("Error fetching listing:", err);
            setListing(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchExistingBid = async () => {
        try {
            const { data, error } = await supabase
                .from("bids")
                .select("*")
                .eq("listing_id", listing.id)
                .eq("user_id", currentUser.id)
                .single();
            if (error && error.code !== "PGRST116") throw error; // Ignore not found
            setExistingBid(data || null);
        } catch (err) {
            console.error("Error fetching existing bid:", err);
        }
    };

    const fetchAllBids = async () => {
        try {
            const { data, error } = await supabase
                .from("bids")
                .select(`*`)
                .eq("listing_id", listing.id)
                .order("created_at", { ascending: true });


            if (error) throw error;
            setAllBids(data || []);
        } catch (err) {
            console.error("Error fetching all bids:", err);
        }
    };

    const submitBid = async (amount, type) => {
        if (!currentUser) return toast.error("You must be logged in.");
        try {
            const { error } = await supabase.from("bids").insert({
                listing_id: listing.id,
                user_id: currentUser.id,
                user_email: currentUser.email,
                amount,
                type, // "accept" | "counter"
                status: "pending",
            });
            if (error) throw error;
            toast.success("Bid submitted!");
            setShowCounterModal(false);
            setBidAmount("");
            fetchExistingBid(); // Refresh the displayed bid
            if (listing.user_id === currentUser.id) fetchAllBids();
        } catch (err) {
            console.error("Error submitting bid:", err);
            toast.error("Failed to submit bid.");
        }
    };

    const withdrawBid = async () => {
        if (!existingBid) return;
        try {
            const { error } = await supabase
                .from("bids")
                .delete()
                .eq("id", existingBid.id);
            if (error) throw error;
            toast.success("Your offer has been withdrawn.");
            setExistingBid(null);
        } catch (err) {
            console.error("Error withdrawing bid:", err);
            toast.error("Failed to withdraw offer.");
        }
    };

    const closeListing = async () => {
        if (!currentUser || currentUser.id !== listing.user_id) return;
        const confirmClose = confirm("Are you sure you want to close this listing? This action cannot be undone.");
        if (!confirmClose) return;

        try {
            const { error } = await supabase
                .from("listings")
                .delete()
                .eq("id", listing.id);
            if (error) throw error;
            toast.success("Listing closed successfully!");
            redirect("/catalog");
        } catch (err) {
            console.error("Error closing listing:", err);
            toast.error("Failed to close listing.");
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow px-4 md:px-10 py-10 mt-[5%]">
                {loading ? (
                    <p className="text-center text-gray-700">Loading listing...</p>
                ) : !listing ? (
                    <p className="text-center text-gray-700">Listing not found.</p>
                ) : (
                    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col gap-6">
                        {/* Main Icon */}
                        <div className="w-full flex items-center justify-center">
                            {listing.type === "consumer" || listing.icon_base64 ? (
                                <Image
                                    src={listing.type === "consumer" ? requestIcon : listing.icon_base64}
                                    alt={listing.title}
                                    width={256}
                                    height={256}
                                    className="w-64 h-64 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-64 h-64 bg-green-100 flex items-center justify-center rounded-lg text-green-600">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Existing Bid */}
                        {existingBid && currentUser.id !== listing.user_id && (
                            <div className="p-4 bg-yellow-100 rounded-lg border border-yellow-400 flex justify-between items-center">
                                <span className="font-semibold text-yellow-800">
                                    Your Offer: JMD {existingBid.amount}
                                </span>
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    onClick={withdrawBid}
                                >
                                    Withdraw
                                </button>
                            </div>
                        )}

                        {/* Owner View: All Bids */}
                        {currentUser.id === listing.user_id && (
                            <div className="p-4 bg-green-50 rounded-lg border border-green-300">
                                <h2 className="text-lg font-semibold text-green-800 mb-2">Current Bids</h2>
                                {allBids.length === 0 ? (
                                    <p className="text-gray-600 italic">No bids yet.</p>
                                ) : (
                                    <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                                        {allBids.map((bid) => (
                                            <li
                                                key={bid.id}
                                                className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                                            >
                                                <div>
                                                    <p className="font-medium text-green-800">
                                                        User: {bid.user_email || "Unknown"}
                                                    </p>
                                                    <p className="text-gray-700">Amount: JMD {bid.amount}</p>
                                                    <p className="text-gray-500 text-sm">
                                                        Time: {new Date(bid.created_at).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end gap-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${bid.status === "pending"
                                                            ? "bg-yellow-400 text-white"
                                                            : bid.status === "accepted"
                                                                ? "bg-green-700 text-white"
                                                                : "bg-red-500 text-white"
                                                            }`}
                                                    >
                                                        {bid.status}
                                                    </span>

                                                    {/* View Profile Button */}
                                                    {bid.user_id && (
                                                        <a
                                                            href={`/profile?id=${bid.user_id}`}
                                                            className="text-sm bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded-md font-medium transition"
                                                        >
                                                            View Profile
                                                        </a>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}



                        {/* Farmer Images */}
                        {listing.type === "farmer" && listing.images_base64?.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold text-green-800 mb-2">Images</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {JSON.parse(listing.images_base64).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition"
                                            onClick={() => setModalImage(img)}
                                        >
                                            <Image
                                                src={img}
                                                alt={`${listing.title} ${idx + 1}`}
                                                width={200}
                                                height={200}
                                                className="w-full h-32 object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Details */}
                        <div className="flex flex-col gap-4">
                            <h1 className="text-2xl font-bold text-green-800">{listing.title}</h1>

                            {/* View Owner Profile */}
                            {listing.user_id && (
                                <a
                                    href={`/profile?id=${listing.user_id}`}
                                    className="self-start bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg font-medium transition"
                                >
                                    View Owner Profile
                                </a>
                            )}

                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${listing.type === "farmer"
                                    ? "bg-green-700 text-white"
                                    : "bg-yellow-400 text-white"
                                    }`}
                            >
                                {listing.type === "farmer" ? "Farmer" : "Consumer"}
                            </span>

                            <p className="text-gray-700 font-medium">
                                {listing.type === "farmer"
                                    ? `Price: JMD ${listing.price}`
                                    : `Offer: JMD ${listing.price}`}
                            </p>

                            {listing.description && (
                                <div>
                                    <h2 className="text-lg font-semibold text-green-800 mb-2">Description</h2>
                                    <p className="text-gray-700">{listing.description}</p>
                                </div>
                            )}

                            <div className="text-gray-500 text-sm mt-auto">
                                <p>Created At: {new Date(listing.created_at).toLocaleDateString()}</p>
                                {listing.category && <p>Category: {listing.category}</p>}
                            </div>

                            {currentUser.id === listing.user_id && (
                                <button
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition mt-4"
                                    onClick={closeListing}
                                >
                                    Close Listing
                                </button>
                            )}

                            {/* Action Buttons for non-owner users */}
                            {!existingBid && currentUser.id !== listing.user_id && (
                                <div className="flex gap-4 mt-4">
                                    {(listing.type === "farmer" || listing.type === "consumer") && (
                                        <>
                                            <button
                                                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                                                onClick={() => submitBid(listing.price, "accept")}
                                            >
                                                {listing.type === "farmer" ? "Buy Now" : "Accept Offer"}
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
                                                onClick={() => setShowCounterModal(true)}
                                            >
                                                Suggest Counter Offer
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Fullscreen Modal */}
                {modalImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/85 bg-opacity-80 flex items-center justify-center p-4"
                        onClick={() => setModalImage(null)}
                    >
                        <Image
                            src={modalImage}
                            alt="Fullscreen"
                            width={800}
                            height={800}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                )}

                {/* Counter Offer Modal */}
                {showCounterModal && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col gap-4">
                            <h2 className="text-lg font-bold text-green-800">Suggest Counter Offer</h2>
                            <input
                                type="number"
                                placeholder="Enter amount (JMD)"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none border-gray-200"
                            />
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setShowCounterModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                                    onClick={() => submitBid(bidAmount, "counter")}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default function ViewPage() {
    return (
        <Suspense fallback={<p className="text-center mt-10">Loading view...</p>}>
            <ViewClient />
        </Suspense>
    );
}