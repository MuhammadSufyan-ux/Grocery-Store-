import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import Newsletter from "./newsletter";
import CartSidebar from "./CartSidebar";

function Layout({ children }) {
    return (
        <div className="w-full overflow-x-hidden">
            <Navbar />
            {children}
            <Newsletter />
            <Footer />
            <CartSidebar />
        </div>
    );
}

export default Layout;

