import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
    try {
        const wishlistData = localStorage.getItem("groceryWishlist");
        return wishlistData ? JSON.parse(wishlistData) : [];
    } catch (error) {
        console.error("Error loading wishlist from localStorage:", error);
        return [];
    }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlistItems) => {
    try {
        localStorage.setItem("groceryWishlist", JSON.stringify(wishlistItems));
    } catch (error) {
        console.error("Error saving wishlist to localStorage:", error);
    }
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState(loadWishlistFromStorage);

    // Save to localStorage whenever wishlistItems change
    useEffect(() => {
        saveWishlistToStorage(wishlistItems);
    }, [wishlistItems]);

    const addToWishlist = (product) => {
        setWishlistItems((prevItems) => {
            // Check if product already exists in wishlist
            const existingItem = prevItems.find((item) => item.id === product.id);
            
            if (existingItem) {
                // Product already in wishlist, don't add duplicate
                return prevItems;
            }
            
            return [...prevItems, { ...product }];
        });
    };

    const removeFromWishlist = (itemId) => {
        setWishlistItems((prevItems) =>
            prevItems.filter((item) => item.id !== itemId)
        );
    };

    const isInWishlist = (itemId) => {
        return wishlistItems.some((item) => item.id === itemId);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const getTotalItems = () => {
        return wishlistItems.length;
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                clearWishlist,
                getTotalItems,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

