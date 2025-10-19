"use client";
import { useEffect, useState } from "react";

export default function AgriNewsList() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const res = await fetch("/api/agri-news");
                if (!res.ok) throw new Error("Failed to load");
                const data = await res.json();
                setArticles(data.articles);
            } catch (err) {
                setError("Could not load agricultural news.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadNews();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading agricultural news…
    </div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
    </div>;

    return (
        <div className="space-y-4">
            {articles.length == 0 ? <div className="w-full flex items-center justify-center text-gray-700">
                Nothing to see here, Check back later!
            </div> : articles.map((a, i) => (
                <div key={i} className="p-4 bg-white rounded-lg shadow">
                    <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-green-700 hover:underline"
                    >
                        {a.title}
                    </a>
                    {a.date && <p className="text-sm text-gray-500 mt-1">{a.date}</p>}
                </div>
            ))}
        </div>
    );
}
