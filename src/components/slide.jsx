import React, { useState } from "react";
import slide1 from "../assets/slides/slide1.png";
import slide2 from "../assets/slides/slide2.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Slides() {
    const slides = [
        { url: slide1, alt: "Slide 1" },
        { url: slide2, alt: "Slide 2" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    return (
        // CONTROLS HEIGHT HERE:
        // h-[250px] for mobile
        // lg:h-[600px] for PC (Increased as requested)
        <div className="w-full h-[250px] lg:h-[700px] p-0 md:p-4 xl:p-4 relative group overflow-hidden">

            {/* Image Tag with object-cover */}
            <img
                src={slides[currentIndex].url}
                alt={slides[currentIndex].alt}
                className="w-full h-full object-cover  duration-500 block"
            />

            {/* Left Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-8 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
                <ChevronLeft onClick={prevSlide} size={30} />
            </div>

            {/* Right Arrow */}
            <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-8 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors">
                <ChevronRight onClick={nextSlide} size={30} />
            </div>

            {/* Dots container */}
            <div className="flex justify-center py-2 absolute bottom-8 w-full gap-2">
                {slides.map((slide, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? "bg-white scale-125" : "bg-white/50"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Slides;
