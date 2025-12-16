import React, { useState, useEffect, useMemo } from "react";
import slide1 from "../assets/slides/slide1.png";
import slide2 from "../assets/slides/slide2.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Default hardcoded slides
const defaultSlides = [
    { url: slide1, alt: "Slide 1" },
    { url: slide2, alt: "Slide 2" },
];

// Default responsive settings
const defaultResponsiveSettings = {
    mobile: { height: "250px", padding: "0" },
    tablet: { height: "400px", padding: "16px" },
    desktop: { height: "700px", padding: "16px" },
};

function Slides() {
    const [slides, setSlides] = useState(defaultSlides);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [responsiveSettings, setResponsiveSettings] = useState(defaultResponsiveSettings);

    // Generate unique ID for this slide instance - must be before any conditional returns
    const slideId = useMemo(() => `slide-${Math.random().toString(36).substr(2, 9)}`, []);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await fetch(`${API_URL}/api/slides?activeOnly=true`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success && data.slides && data.slides.length > 0) {
                // Use slides from database
                const formattedSlides = data.slides.map((slide) => ({
                    url: slide.image,
                    alt: slide.alt || slide.title || "Slide",
                    link: slide.link || null,
                }));
                setSlides(formattedSlides);

                // Use responsive settings from first slide if available
                if (data.slides[0].responsiveSettings) {
                    setResponsiveSettings(data.slides[0].responsiveSettings);
                }
            } else {
                // Use default hardcoded slides
                setSlides(defaultSlides);
                setResponsiveSettings(defaultResponsiveSettings);
            }
        } catch (err) {
            console.error("Error fetching slides:", err);
            // Fallback to default slides on error
            setSlides(defaultSlides);
            setResponsiveSettings(defaultResponsiveSettings);
        } finally {
            setLoading(false);
        }
    };

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

    const handleSlideClick = () => {
        if (slides[currentIndex].link) {
            window.open(slides[currentIndex].link, "_blank");
        }
    };

    // Build dynamic style based on responsive settings
    const getContainerStyle = () => {
        return {
            height: responsiveSettings.mobile.height,
            padding: responsiveSettings.mobile.padding,
        };
    };

    if (loading) {
        return (
            <div className="w-full" style={getContainerStyle()}>
                <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <p className="text-gray-500">Loading slides...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Dynamic styles for responsive settings */}
            <style>{`
                #${slideId} {
                    height: ${responsiveSettings.mobile.height};
                    padding: ${responsiveSettings.mobile.padding};
                }
                @media (min-width: 768px) {
                    #${slideId} {
                        height: ${responsiveSettings.tablet.height};
                        padding: ${responsiveSettings.tablet.padding};
                    }
                }
                @media (min-width: 1024px) {
                    #${slideId} {
                        height: ${responsiveSettings.desktop.height};
                        padding: ${responsiveSettings.desktop.padding};
                    }
                }
            `}</style>
            <div id={slideId} className="w-full relative group overflow-hidden">
                <div className="w-full h-full relative">
                {/* Image Tag with object-cover */}
                <img
                    src={slides[currentIndex].url}
                    alt={slides[currentIndex].alt}
                    className="w-full h-full object-cover duration-500 block"
                    onClick={handleSlideClick}
                    style={{ cursor: slides[currentIndex].link ? "pointer" : "default" }}
                />

                {/* Left Arrow */}
                <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-8 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors z-10">
                    <ChevronLeft onClick={prevSlide} size={30} />
                </div>

                {/* Right Arrow */}
                <div className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-8 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-colors z-10">
                    <ChevronRight onClick={nextSlide} size={30} />
                </div>

                {/* Dots container */}
                {slides.length > 1 && (
                    <div className="flex justify-center py-2 absolute bottom-8 w-full gap-2 z-10">
                        {slides.map((slide, slideIndex) => (
                            <div
                                key={slideIndex}
                                onClick={() => goToSlide(slideIndex)}
                                className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentIndex === slideIndex ? "bg-white scale-125" : "bg-white/50"
                                }`}
                            ></div>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </>
    );
}

export default Slides;
