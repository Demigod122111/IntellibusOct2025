"use client";
import { useState } from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { Upload, Leaf, ShoppingBasket } from "lucide-react";
import ImageUploadBox from "@/app/components/ImageUploadBox";
import ListingIconUpload from "@/app/components/ListingIconUpload";
import { createListing } from "@/lib/lisiting";

export default function NewCatalog() {
    const [mode, setMode] = useState("farmer"); // "farmer" or "consumer"

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow py-16 px-4 md:px-10">
                <div className="max-w-5xl mx-auto">
                    {/* Toggle Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-xl md:text-3xl font-extrabold text-green-900 mb-4">
                            Create a New Listing
                        </h1>
                        <p className="text-gray-700 text-lg">
                            Choose whether you’re a farmer offering produce or a customer requesting it.
                        </p>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex justify-center gap-4 mb-10">
                        <button
                            onClick={() => setMode("farmer")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${mode === "farmer"
                                ? "bg-green-700 text-white shadow-lg"
                                : "bg-white text-green-800 border border-green-400 hover:bg-green-100"
                                }`}
                        >
                            <Leaf className="w-5 h-5" />
                            Farmer Listing
                        </button>

                        <button
                            onClick={() => setMode("consumer")}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${mode === "consumer"
                                ? "bg-green-700 text-white shadow-lg"
                                : "bg-white text-green-800 border border-green-400 hover:bg-green-100"
                                }`}
                        >
                            <ShoppingBasket className="w-5 h-5" />
                            Consumer Request
                        </button>
                    </div>

                    {/* Forms */}
                    <div className="bg-white shadow-xl rounded-2xl p-8 md:p-10 border border-green-100">
                        {mode === "farmer" ? <FarmerForm /> : <ConsumerForm />}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

/* ---------------- FARMER FORM ---------------- */
export function FarmerForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [iconBase64, setIconBase64] = useState("");
    const [imagesBase64, setImagesBase64] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [preview, setPreview] = useState(null);
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (!imagesBase64) {
                throw new Error("Images not ready yet. Please wait a moment.");
            }

            await createListing({
                type: "farmer",
                title,
                description,
                price: parseFloat(price),
                iconBase64,
                imageBase64ArrayJson: JSON.stringify(imagesBase64),
            });

            setMessage("Listing created successfully!");
            setTitle("");
            setDescription("");
            setPrice("");
            setIconBase64("");
            setImagesBase64([]);
            setImages([]);
            setPreview(null);
        } catch (error) {
            console.error("Error creating listing:", error);
            setMessage("Failed to create listing. Try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-green-800 text-center mb-4">
                Farmer Produce Listing
            </h2>

            <div>
                <label className="block font-semibold text-gray-800 mb-2">Produce Name</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="e.g., Fresh Tomatoes"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                    required
                />
            </div>

            <div>
                <label className="block font-semibold text-gray-800 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    placeholder="Describe your produce, quality, quantity, etc."
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none resize-none"
                    required
                ></textarea>
            </div>

            <div>
                <label className="block font-semibold text-gray-800 mb-2">Preferred Price</label>
                <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    placeholder="e.g., 250 (per kg or bundle)"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                    required
                />
            </div>

            <ListingIconUpload onChange={setIconBase64} preview={preview} setPreview={setPreview} />
            <ImageUploadBox onChange={setImagesBase64} images={images} setImages={setImages} />

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition"
            >
                {loading ? "Creating..." : "Create Listing"}
            </button>

            {message && <p className="text-center mt-4 font-semibold text-gray-700">{message}</p>}
        </form>
    );
}

/* ---------------- CONSUMER FORM ---------------- */
export function ConsumerForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await createListing({
                type: "consumer",
                title,
                description,
                price: parseFloat(price),
                iconBase64: null,
                imagesBase64: [],
            });
            setMessage("Request submitted successfully!");
            setTitle("");
            setDescription("");
            setPrice("");
        } catch (error) {
            console.error("Error creating request:", error);
            setMessage("Failed to submit request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-green-800 text-center mb-4">
                Consumer Produce Request
            </h2>

            <div>
                <label className="block font-semibold text-gray-800 mb-2">Produce Needed</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    type="text"
                    placeholder="e.g., 10 lbs of Carrots"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                    required
                />
            </div>

            <div>
                <label className="block font-semibold text-gray-800 mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    placeholder="Describe what you need, desired quality, or timeframe."
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none resize-none"
                    required
                ></textarea>
            </div>

            <div>
                <label className="block font-semibold text-gray-800 mb-2">Budget / Offer</label>
                <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    placeholder="e.g., 3000 (JMD total)"
                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg transition"
            >
                {loading ? "Submitting..." : "Submit Request"}
            </button>

            {message && <p className="text-center mt-4 font-semibold text-gray-700">{message}</p>}
        </form>
    );
}