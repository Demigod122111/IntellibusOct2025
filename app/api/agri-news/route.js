export async function GET() {
    const query = encodeURIComponent("Jamaica agriculture site:news.google.com");
    const url = `https://serpapi.com/search.json?q=${query}&location=Austin,+Texas,+United+States&hl=en&gl=us&google_domain=google.com`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const articles = (data.organic_results || []).slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet,
        }));

        return new Response(JSON.stringify({ articles }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
        });
    } catch (err) {
        console.error("Error fetching news:", err);
        return new Response(JSON.stringify({ error: "Failed to fetch news." }), { status: 500 });
    }
}
