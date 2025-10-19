"use client";
import { useState } from "react";
import { X } from "lucide-react";

export default function ListingIconUpload({ onChange, preview, setPreview }) {
    const [fullscreen, setFullscreen] = useState(false);

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) {
            setPreview(null);
            onChange?.(null);
            return;
        }

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        // Convert to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result;
            onChange?.(base64);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <label className="block font-semibold text-gray-800 mb-2">
                Listing Icon
            </label>

            <div className="flex items-center gap-4">
                {/* Preview box */}
                <div
                    className="w-16 h-16 border-2 border-green-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden cursor-pointer"
                    onClick={() => preview && setFullscreen(true)}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Listing Icon Preview"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-150"
                        />
                    ) : (
                        <span className="text-xs text-gray-400 text-center px-1">
                            64×64
                        </span>
                    )}
                </div>

                {/* File input */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="flex-1 border rounded-lg px-4 py-2 cursor-pointer focus:ring-2 focus:ring-green-600 focus:outline-none"
                />
            </div>

            {/* Fullscreen preview */}
            {fullscreen && preview && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn"
                    onClick={() => setFullscreen(false)}
                >
                    <div
                        className="relative max-w-3xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setFullscreen(false)}
                            className="absolute top-2 right-2 bg-black/60 rounded-full p-2 text-white hover:bg-black transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={preview}
                            alt="Fullscreen Listing Icon"
                            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Fade-in animation */}
            <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
}
