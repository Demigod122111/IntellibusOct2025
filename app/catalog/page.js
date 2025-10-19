"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { supabase } from "@/lib/database";
import Image from "next/image";

export default function Catalog() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all"); // all | farmer | consumer
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortOrder, setSortOrder] = useState("asc"); // asc | desc

    useEffect(() => {
        fetchListings();
    }, []);

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

    // Apply filters
    const filteredListings = listings
        .filter((l) => {
            // Type filter
            if (filterType !== "all" && l.type !== filterType) return false;

            // Search filter
            if (searchQuery && !l.title.toLowerCase().includes(searchQuery.toLowerCase()))
                return false;

            // Price range filter
            if (minPrice && l.price < parseFloat(minPrice)) return false;
            if (maxPrice && l.price > parseFloat(maxPrice)) return false;

            return true;
        })
        .sort((a, b) => {
            // Sort by price
            if (sortOrder === "asc") return a.price - b.price;
            else return b.price - a.price;
        });

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow px-4 md:px-10 py-10">
                {/* Create Listing Button */}
                <div className="flex justify-center md:justify-end mb-6">
                    <a
                        href="/catalog/new"
                        className="mt-[5%] md:mt-[3%] px-3 py-1 border border-green-700font-semibold rounded-full shadow-lg text-green-800 hover:text-white hover:bg-green-800 transition text-base"
                    >
                        + Create Listing
                    </a>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 justify-center items-center">
                    {/* Type Filter */}
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
                        title="Minimum Price"
                        className="px-4 py-2 border rounded-lg w-24 min-w-[130px] focus:ring-2 focus:ring-green-600 outline-none border-gray-200"
                    />
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max Price"
                        title="Maximum Price"
                        className="px-4 py-2 border rounded-lg min-w-[130px] w-24 focus:ring-2 focus:ring-green-600 outline-none border-gray-200"
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
                        {filteredListings.map((listing) => (
                            <div
                                key={listing.id}
                                className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
                            >
                                {/* Icon */}
                                <div className="w-20 h-20 mb-4">
                                    {listing.icon_base64 ? (
                                        <Image
                                            src={listing.icon_base64}
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

                                {/* Price / Budget */}
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
                                    {listing.type === "farmer" ? "Farmer" : "Consumer"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
