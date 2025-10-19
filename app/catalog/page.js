"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { supabase } from "@/lib/database";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import requestIcon from "../static_data/images/request.png";

export default function Catalog() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [bids, setBids] = useState([]); // user's bids

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    // Initialize filters from URL
    useEffect(() => {
        if (searchParams) {
            setFilterType(searchParams.get("type") || "all");
            setSearchQuery(searchParams.get("q") || "");
            setMinPrice(searchParams.get("min") || "");
            setMaxPrice(searchParams.get("max") || "");
            setSortOrder(searchParams.get("sort") || "asc");
        }
    }, [searchParams]);

    // Fetch user session and listings
    useEffect(() => {
        fetchUser();
        fetchListings();
    }, []);

    const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUser(data?.user || null);

        if (data?.user) {
            const { data: userBids } = await supabase
                .from("bids")
                .select("listing_id")
                .eq("user_id", data.user.id);
            setBids(userBids?.map((b) => b.listing_id) || []);
        }
    };

    const fetchListings = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from("listings").select("*");
            if (error) throw error;
            setListings(data);
        } catch (err) {
            console.error("Error fetching listings:", err);
        } finally {
            setLoading(false);
        }
    };

    // Update URL whenever filters change
    useEffect(() => {
        const params = new URLSearchParams();
        if (filterType && filterType !== "all") params.set("type", filterType);
        if (searchQuery) params.set("q", searchQuery);
        if (minPrice) params.set("min", minPrice);
        if (maxPrice) params.set("max", maxPrice);
        if (sortOrder && sortOrder !== "asc") params.set("sort", sortOrder);

        router.replace(`/catalog?${params.toString()}`, { shallow: true });
    }, [filterType, searchQuery, minPrice, maxPrice, sortOrder, router]);

    // Apply filters
    const filteredListings = listings
        .filter((l) => {
            if (filterType !== "all" && l.type !== filterType) return false;
            if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase()))
                return false;
            if (minPrice && l.price < parseFloat(minPrice)) return false;
            if (maxPrice && l.price > parseFloat(maxPrice)) return false;
            return true;
        })
        .sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));

    // Determine badge text
    const getBadgeText = (listing) => {
        if (!user) return listing.type === "farmer" ? "Farmer" : "Consumer";
        if (listing.user_id === user.id) return "Owner";
        if (bids.includes(listing.id)) return "Interested";
        return listing.type === "farmer" ? "Farmer" : "Consumer";
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow px-4 md:px-10 py-10">
                {/* Create Listing Button */}
                <div className="flex justify-center md:justify-end mb-6">
                    <a
                        href="/catalog/new"
                        className="mt-[5%] md:mt-[3%] px-3 py-1 border border-green-700 font-semibold rounded-full shadow-lg text-green-800 hover:text-white hover:bg-green-800 transition text-base"
                    >
                        + Create Listing
                    </a>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 justify-center items-center">
                    {["all", "farmer", "consumer"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilterType(f)}
                            className={`px-4 py-2 rounded-full font-semibold transition ${filterType === f
                                    ? "bg-green-700 text-white shadow-lg"
                                    : "bg-white text-green-800 border border-green-400 hover:bg-green-100"
                                }`}
                        >
                            {f === "all" ? "All Listings" : f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}

                    {/* Search */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title..."
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none border-gray-200"
                    />

                    {/* Price Range */}
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min Price"
                        className="px-4 py-2 border rounded-lg min-w-[130px] focus:ring-2 focus:ring-green-600 outline-none border-gray-200"
                    />
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max Price"
                        className="px-4 py-2 border rounded-lg min-w-[130px] focus:ring-2 focus:ring-green-600 outline-none border-gray-200"
                    />

                    {/* Sort */}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none border-gray-200 text-gray-600"
                    >
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>

                {/* Listings Grid */}
                {loading ? (
                    <p className="text-center text-gray-700">Loading listings...</p>
                ) : filteredListings.length === 0 ? (
                    <p className="text-center text-gray-700">No listings found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredListings.map((listing) => {
                            const badgeText = getBadgeText(listing);

                            return (
                                <div
                                    key={listing.id}
                                    className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
                                    onClick={() => router.push(`/catalog/view?id=${listing.id}`)}
                                >
                                    {/* Icon */}
                                    <div className="w-20 h-20 mb-4">
                                        {listing.type == "consumer" || listing.icon_base64 ? (
                                            <Image
                                                src={
                                                    listing.type == "consumer"
                                                        ? requestIcon
                                                        : listing.icon_base64
                                                }
                                                alt={listing.title}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-green-100 flex items-center justify-center rounded-lg text-green-600">
                                                Icon
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-green-800 text-center mb-2">
                                        {listing.title}
                                    </h3>

                                    {/* Price */}
                                    <p className="text-gray-700 font-medium">
                                        {listing.type === "farmer"
                                            ? `JMD ${listing.price}`
                                            : `Offer: JMD ${listing.price}`}
                                    </p>

                                    {/* Badge */}
                                    <span
                                        className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${listing.type === "farmer"
                                                ? "bg-green-700 text-white"
                                                : "bg-yellow-500 text-white"
                                            }`}
                                    >
                                        {badgeText}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}