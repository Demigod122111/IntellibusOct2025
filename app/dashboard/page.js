import Footer from "../components/footer";
import Navbar from "../components/navbar";


export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F2F8F2]">
            <Navbar />
            <main className="flex-grow">
                <h3>Big Bad Dashboard eno</h3>
            </main>
            <Footer />
        </div>
    );
}