import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Properties } from "../static_data/properties";

export default function DataPage() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar redirectAuth={false} />
            <main className="flex-grow px-4 mt-[5%] md:mt-[8%] md:px-10 py-10 max-w-5xl mx-auto">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
                    Legal & Data Policies
                </h1>

                {/* Navigation Links */}
                <div className="flex gap-4 justify-center mb-8">
                    <a href="#privacy-policy" className="text-green-700 hover:underline">
                        Privacy Policy
                    </a>
                    <a href="#terms-of-service" className="text-green-700 hover:underline">
                        Terms of Service
                    </a>
                </div>

                {/* Privacy Policy Section */}
                <section id="privacy-policy" className="mb-16">
                    <h2 className="text-2xl font-semibold text-green-800 mb-4">
                        Privacy Policy
                    </h2>
                    <p className="text-gray-700 mb-4">
                        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Information We Collect</h3>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li>Personal information you provide (name, email, contact details).</li>
                        <li>Data related to your listings, bids, and interactions on our platform.</li>
                        <li>Technical information such as IP address, browser type, and usage data.</li>
                    </ul>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">How We Use Your Information</h3>
                    <p className="text-gray-700 mb-4">
                        We use your information to provide and improve our services, communicate with you, and ensure a safe and secure environment for all users.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Data Sharing</h3>
                    <p className="text-gray-700 mb-4">
                        We do not sell your personal information. We may share data with third-party services to provide essential functionality, comply with legal obligations, or protect our rights.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Cookies and Tracking</h3>
                    <p className="text-gray-700 mb-4">
                        We use cookies and similar technologies to enhance your experience, analyze traffic, and customize content.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Your Rights</h3>
                    <p className="text-gray-700 mb-4">
                        You have the right to access, modify, or delete your personal data. Contact us at our support email for any requests.
                    </p>
                </section>

                {/* Terms of Service Section */}
                <section id="terms-of-service" className="mb-16">
                    <h2 className="text-2xl font-semibold text-green-800 mb-4">
                        Terms of Service
                    </h2>
                    <p className="text-gray-700 mb-4">
                        By using our platform, you agree to comply with these Terms of Service. Please read them carefully.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Account Responsibilities</h3>
                    <p className="text-gray-700 mb-4">
                        Users must provide accurate information and maintain the confidentiality of their account credentials. You are responsible for all activities under your account.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">User Conduct</h3>
                    <p className="text-gray-700 mb-4">
                        You agree not to engage in any activity that violates laws or regulations, infringes on others' rights, or disrupts our platform.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Listings and Transactions</h3>
                    <p className="text-gray-700 mb-4">
                        All listings and bids are the responsibility of the respective users. We are not liable for any disputes, damages, or losses resulting from transactions.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Termination</h3>
                    <p className="text-gray-700 mb-4">
                        We reserve the right to suspend or terminate accounts that violate our policies or engage in harmful behavior.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Changes to Terms</h3>
                    <p className="text-gray-700 mb-4">
                        We may update these Terms of Service from time to time. Continued use of the platform constitutes acceptance of the updated terms.
                    </p>

                    <h3 className="text-xl font-semibold text-green-700 mt-4 mb-2">Contact</h3>
                    <p className="text-gray-700">
                        For questions about these policies, please contact us at {Properties.SupportEmail}.
                    </p>
                </section>
            </main>
            <Footer />
        </div>
    );
}
