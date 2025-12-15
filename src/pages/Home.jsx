import Hero from "../components/hero";
import MainHome from "../components/home/main-home";

function Home() {
    return (
        <div className="w-full overflow-x-hidden">
            <Hero />
            <MainHome />
        </div>
    );
}

export default Home;

