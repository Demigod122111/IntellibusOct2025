"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Properties } from "../static_data/properties";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white shadow-md text-gray-900"
                : "bg-transparent text-gray-900"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold">
                    {Properties.AppName}
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex space-x-8 font-medium">
                    <Link href="#features" className="hover:text-green-600 transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="hover:text-green-600 transition-colors">
                        Pricing
                    </Link>
                    <Link href="#contact" className="hover:text-green-600 transition-colors">
                        Contact
                    </Link>
                </div>

                {/* CTA Button */}
                <Link
                    href="#get-started"
                    className={`ml-4 px-5 py-2 rounded-lg font-semibold transition-colors ${scrolled
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-white text-green-700 hover:bg-gray-100"
                        }`}
                >
                    Get Started
                </Link>
            </div>
        </nav>
    );
}
