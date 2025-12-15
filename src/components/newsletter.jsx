import React from "react";
import { Send } from "lucide-react";
import dontmissBG from "../assets/products/dontmissBG.png";

function Newsletter() {
    return (
        <div
            className="relative overflow-hidden  bg-[#D8F1E5] bg-cover bg-bottom p-10 lg:p-16"
            style={{ backgroundImage: `url(${dontmissBG})` }}
        >
            <div className="relative z-10 max-w-xl">
                <h2 className="mb-4 text-4xl font-bold text-[#253D4E] lg:text-5xl">
                    Don't miss our daily amazing deals.
                </h2>
                <p className="mb-10 text-lg text-[#7E7E7E]">
                    Save up to 60% off on your first order
                </p>

                <form className="flex w-full max-w-md items-center overflow-hidden rounded-full bg-white p-1.5">
                    <Send className="ml-4 h-5 w-5 text-[#ADADAD]" />
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="w-full bg-transparent px-4 py-3 text-sm text-[#253D4E] outline-none placeholder:text-[#ADADAD]"
                    />
                    <button className="rounded-full bg-[#3B745B] px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2a5542]">
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Newsletter;

