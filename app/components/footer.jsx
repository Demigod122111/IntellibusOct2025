import { Properties } from "../static_data/properties";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-10 mt-20">
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-3">{Properties.AppName}</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Empowering Jamaica’s farmers with tools, data, and community — all in one place.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link href="/#features" className="hover:text-green-400 transition">Features</Link></li>
                        <li><Link href="/#pricing" className="hover:text-green-400 transition">Pricing</Link></li>
                        <li><Link href="#contact" className="hover:text-green-400 transition">Contact</Link></li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Resources</h3>
                    <ul className="space-y-2">
                        <li><Link href="#" className="hover:text-green-400 transition">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-green-400 transition">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-green-400 transition">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-green-400 transition">Support</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div id="contact">
                    <h3 className="text-lg font-semibold text-white mb-3">Contact</h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-green-400" />
                            <span>{Properties.SupportContact}</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="w-5 h-5 text-green-400" />
                            <span>{Properties.SupportEmail}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm text-gray-400">
                © {new Date().getFullYear()} {Properties.AppName} Jamaica. All rights reserved.
            </div>
        </footer>
    );
}
