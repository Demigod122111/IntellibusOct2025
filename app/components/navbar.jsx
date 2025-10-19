"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Properties } from "../static_data/properties";
import { getCurrentUser } from "@/lib/auth";
import { redirect, usePathname } from "next/navigation";
import { supabase } from "@/lib/database";

import logo from "../static_data/images/logo.png";
import Image from "next/image";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        async function run() {
            const user = await getCurrentUser();

            if (!user && pathname !== "/auth" && pathname !== "/") {
                redirect("/auth");
            }


            setUser(user);
        }

        run();

        // Subscribe to auth state changes
        const { data: listener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (!session || !session.user) {
                    // User logged out or session expired
                    redirect("/auth");
                }
            }
        );

        // Cleanup subscription
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const getCta = () => {
        switch (pathname) {
            case "/catalog":
                return <></>;
            default:
                return <Link
                    href="/catalog"
                    className={`ml-4 px-5 py-2 rounded-lg font-semibold transition-colors ${scrolled
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-white text-green-700 hover:bg-gray-100"
                        }`}
                >
                    Catalog
                </Link>;
        }
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? "bg-white shadow-md text-gray-900"
                : "bg-transparent text-gray-900"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/">
                    <Image
                        src={logo}
                        width={64}
                        height={64}
                        alt="Logo"
                    />
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex space-x-8 font-medium">
                    <Link href="/#features" className="hover:text-green-600 transition-colors">
                        Features
                    </Link>
                    <Link href="/#pricing" className="hover:text-green-600 transition-colors">
                        Pricing
                    </Link>
                    <Link href="#contact" className="hover:text-green-600 transition-colors">
                        Contact
                    </Link>
                </div>

                {/* CTA Button */}
                {
                    user == null ?
                        <Link
                            href="/auth"
                            className={`ml-4 px-5 py-2 rounded-lg font-semibold transition-colors ${scrolled
                                ? "bg-green-600 text-white hover:bg-green-700"
                                : "bg-white text-green-700 hover:bg-gray-100"
                                }`}
                        >
                            Login/Register
                        </Link>
                        : getCta()
                }
            </div>
        </nav>
    );
}
