"use client";
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { signUp, signIn, supabase } from "@/lib/database";
import { isStrongPassword } from "@/lib/helpers";
import { redirect } from "next/navigation";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!isLogin && !isStrongPassword(password)) {
            setError(
                "Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 special character."
            );
            return;
        }

        if (isLogin) {
            const { data, error } = await signIn(email, password);
            if (error) {
                setError(error.message);
            }
            else {
                setMessage("Logged in successfully!\nRedirecting...");
                redirect("/catalog");
            }
        } else {
            const { data, error } = await signUp(email, password, fullName);

            if (error) {
                setError(error.message);
            }

            // Insert into users table after signup
            const { error: syncError } = await supabase.from("users").insert([
                {
                    user_id: data.user.id,
                    email: email,
                },
            ]);

            if (syncError) {
                console.error("Error inserting user record:", syncError);
                setError("Registration Failed!\nPlease try again or contact support.");
            } else {
                setMessage("Check your email to confirm registration!");
                setIsLogin(true);
            }
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow">
                <section className="flex items-center justify-center min-h-[75vh] bg-gray-50 px-4">
                    <div className="w-full max-w-md perspective">
                        {/* Flip Card */}
                        <div
                            className={`relative top-[-20vh] w-full transition-transform duration-700 transform-style-preserve-3d ${isLogin ? "" : "rotate-y-180"
                                }`}
                        >
                            {/* Login Form */}
                            <div className="absolute w-full backface-hidden bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                                    Login
                                </h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black border-gray-300 focus:ring-green-600"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black border-gray-300 focus:ring-green-600"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-semibold transition"
                                    >
                                        Login
                                    </button>
                                </form>
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                                {message && <p className="text-green-600 mt-2">{message}</p>}
                                <p className="mt-4 text-center text-sm text-gray-600">
                                    Don’t have an account?{" "}
                                    <button
                                        onClick={toggleForm}
                                        className="text-green-700 font-semibold hover:underline"
                                    >
                                        Register
                                    </button>
                                </p>
                            </div>

                            {/* Register Form */}
                            <div className="absolute w-full rotate-y-180 backface-hidden bg-white rounded-2xl shadow-xl p-8">
                                <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
                                    Register
                                </h2>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black border-gray-300 focus:ring-green-600"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black border-gray-300 focus:ring-green-600"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-black border-gray-300 focus:ring-green-600"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full bg-green-700 hover:bg-green-800 text-white py-2 rounded-lg font-semibold transition"
                                    >
                                        Register
                                    </button>
                                </form>
                                {error && <p className="text-red-500 mt-2">{error}</p>}
                                {message && <p className="text-green-600 mt-2">{message}</p>}
                                <p className="mt-4 text-center text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <button
                                        onClick={toggleForm}
                                        className="text-green-700 font-semibold hover:underline"
                                    >
                                        Login
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tailwind Custom CSS */}
                    <style jsx>{`
            .perspective {
              perspective: 1000px;
            }
            .backface-hidden {
              backface-visibility: hidden;
            }
            .rotate-y-180 {
              transform: rotateY(180deg);
            }
            .transform-style-preserve-3d {
              transform-style: preserve-3d;
            }
          `}</style>
                </section>
                <Footer />
            </main>
        </div>
    );
}