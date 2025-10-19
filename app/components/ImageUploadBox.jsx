"use client";
import { useState } from "react";
import { Upload, X } from "lucide-react";

export default function ImageUploadBox({ onChange, images, setImages }) {
    const [fullscreenImage, setFullscreenImage] = useState(null);

    // Convert files to base64
    const filesToBase64 = async (files) => {
        const promises = files.map(
            (file) =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
        );
        return Promise.all(promises);
    };

    const handleFiles = async (files) => {
        setImages(files);
        const base64Images = await filesToBase64(files);
        onChange?.(base64Images);
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        await handleFiles(files);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        await handleFiles(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const openFullscreen = (imageUrl) => {
        setFullscreenImage(imageUrl);
    };

    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <div>
            <label className="block font-semibold text-gray-800 mb-2">
                Upload Images
            </label>

            {/* Upload Area */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:bg-green-50 transition cursor-pointer relative"
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-10 h-10 mx-auto text-green-700 mb-2" />
                <p className="text-sm text-gray-600">Click or drag to upload images</p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((file, i) => {
                        const imageUrl = URL.createObjectURL(file);
                        return (
                            <div
                                key={i}
                                className="relative w-64 h-64 border border-green-200 rounded-lg overflow-hidden bg-gray-100 shadow-sm cursor-pointer"
                                onClick={() => openFullscreen(imageUrl)}
                            >
                                <img
                                    src={imageUrl}
                                    alt={`upload-${i}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Fullscreen Viewer */}
            {fullscreenImage && (
                <div
                    onClick={closeFullscreen}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn"
                >
                    <div
                        className="relative max-w-4xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking on image
                    >
                        <button
                            onClick={closeFullscreen}
                            className="absolute top-2 right-2 bg-black/60 rounded-full p-2 text-white hover:bg-black transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={fullscreenImage}
                            alt="fullscreen"
                            className="w-auto h-auto max-w-full max-h-[90vh] rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}

            {/* Simple fade-in animation */}
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