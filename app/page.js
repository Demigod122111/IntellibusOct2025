"use client";
import { Sprout, DollarSign, MessageCircle, BarChart3, ShieldCheck, Globe2 } from "lucide-react";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { Properties } from "./static_data/properties";
import Image from "next/image";
import Link from "next/link";

import heroImage from "./static_data/images/happy-farming-with-sustainable-small-business-agriculture-portrait-smiling-farmer-africa_875825-185433.png"
import logo from "./static_data/images/logo.png"
import { redirect } from "next/navigation";
import AgriNewsList from "./components/AgriNewsList";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
      <Navbar redirectAuth={false} />
      <main className="flex-grow">

        <section
          id="hero"
          className="relative w-full h-[100vh] flex items-center justify-center overflow-hidden"
        >
          {/* Background Image */}
          <Image
            src={heroImage}
            alt="Farm field background"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Light Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/15 to-green-20" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center px-6 max-w-3xl mx-auto">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src={logo}
                width={256}
                height={256}
                alt="Logo"
                className="mx-auto"
              />
            </div>

            {/* Description Box */}
            <div className="relative w-full bg-black/20 rounded-2xl py-10 px-6 text-center shadow-lg">
              <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                {Properties.AppDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/catalog"
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
              >
                Engage
              </Link>
              <Link
                href="#features"
                className="bg-white border border-green-300 hover:bg-green-50 text-green-800 px-8 py-3 rounded-lg text-lg font-semibold transition shadow-sm"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left">
              {/* Feature 1 */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8 hover:shadow-lg transition">
                <Sprout className="w-10 h-10 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Direct Farmer Listings</h3>
                <p className="text-gray-700">
                  Farmers can easily list crops, livestock, and products — giving consumers a direct view of what’s available locally without middlemen.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8 hover:shadow-lg transition">
                <DollarSign className="w-10 h-10 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Negotiable Pricing</h3>
                <p className="text-gray-700">
                  Each farmer sets an initial price, but consumers can propose their own — ensuring fair, flexible pricing that benefits both sides.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8 hover:shadow-lg transition">
                <MessageCircle className="w-10 h-10 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Built-in Chat</h3>
                <p className="text-gray-700">
                  Farmers and consumers can communicate directly inside AgriDex to discuss deals, delivery options, and crop details — all in real-time.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8 hover:shadow-lg transition">
                <BarChart3 className="w-10 h-10 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Market Insights</h3>
                <p className="text-gray-700">
                  AgriDex provides regional price trends, crop performance data, and seasonal insights to help farmers plan smarter and consumers buy wiser.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8 hover:shadow-lg transition">
                <ShieldCheck className="w-10 h-10 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Verified Profiles</h3>
                <p className="text-gray-700">
                  Both farmers and consumers can earn verification badges through consistent, honest transactions — building transparency and trust.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-green-50 border border-green-100 rounded-2xl p-8 hover:shadow-lg transition">
                <Globe2 className="w-10 h-10 text-green-700 mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Community Marketplace</h3>
                <p className="text-gray-700">
                  {Properties.AppName} isn’t just an app — it’s a growing network of farmers, buyers, and advocates working together to make agriculture more sustainable and accessible.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="news"
          className="bg-green-50 py-16 px-6 text-center"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 mb-4">Latest Jamaican Agriculture News</h2>
            <AgriNewsList limit={5} />
          </div>
        </section>

        <section
          id="pricing"
          className="bg-green-50 py-16 px-6 text-center"
        >
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-green-800 mb-4">
              Our Pricing Plans
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-12">
              Fair, flexible, and always farmer-friendly.
            </p>

            {/* Card */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              {/* Banner */}
              <div className="bg-green-700 text-white py-4 px-6 text-1xl md:text-2xl font-bold">
                🌾 Basic Plan – Pro Plan – Enterprise Plan
              </div>

              {/* Content */}
              <div className="py-10 px-6 flex flex-col items-center justify-center">
                <h3 className="text-5xl md:text-6xl font-extrabold text-green-800 mb-3">
                  $0<span className="text-2xl align-super">*</span>
                </h3>
                <p className="text-gray-600 text-base md:text-lg mb-6">
                  Yup. You read that right.
                </p>
                <p className="text-lg text-green-700 max-w-md mx-auto leading-relaxed">
                  {Properties.AppName} is <span className="font-bold">free to use</span> — we don’t charge
                  farmers or customers. Actual produce prices are <span className="font-semibold">negotiated directly</span>{" "}
                  between farmers and buyers, ensuring everyone gets a fair deal.
                </p>

                <button className="mt-8 bg-green-700 text-white px-6 py-2.5 rounded-lg text-base md:text-lg font-semibold hover:bg-green-800 transition"
                  onClick={() => redirect("/catalog")}>
                  Start Negotiating
                </button>
              </div>

              {/* Footer Note */}
              <div className="bg-green-100 text-gray-600 text-sm py-3 px-6 italic">
                *Because fair prices grow better communities.
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
