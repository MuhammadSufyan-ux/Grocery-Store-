import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
    const { user, token, isAuthenticated } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const isSyncingRef = useRef(false);

    // Fetch wishlist from backend when user is authenticated
    const fetchWishlistFromBackend = async () => {
        if (!token || !isAuthenticated()) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/wishlist`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setWishlistItems(data.wishlist || []);
                    // Clear localStorage when using backend
                    localStorage.removeItem("groceryWishlist");
                }
            }
        } catch (error) {
            console.error("Error fetching wishlist from backend:", error);
        } finally {
            setLoading(false);
        }
    };

    // Sync localStorage wishlist to backend on login
    const syncLocalStorageToBackend = async () => {
        if (!token || !isAuthenticated() || isSyncingRef.current) return;

        const localWishlist = loadWishlistFromStorage();
        if (localWishlist.length === 0) {
            fetchWishlistFromBackend();
            return;
        }

        try {
            isSyncingRef.current = true;
            // Helper function to check if string is a valid MongoDB ObjectId
            const isValidObjectId = (id) => {
                return id && typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
            };

            // Add each item from localStorage to backend (only if it has a valid ObjectId)
            for (const item of localWishlist) {
                const productId = item.id || item._id;
                
                // Skip items with invalid ObjectIds (likely hardcoded/test data)
                if (!isValidObjectId(productId)) {
                    console.warn(`Skipping wishlist item with invalid product ID: ${productId}`);
                    continue;
                }

                try {
                    await fetch(`${API_URL}/api/wishlist/${productId}`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                } catch (error) {
                    console.error(`Error syncing wishlist item ${productId}:`, error);
                    // Continue with next item even if one fails
                }
            }

            // Clear localStorage and fetch updated wishlist from backend
            localStorage.removeItem("groceryWishlist");
            await fetchWishlistFromBackend();
        } catch (error) {
            console.error("Error syncing wishlist to backend:", error);
        } finally {
            isSyncingRef.current = false;
        }
    };

    // Load wishlist when component mounts or user/auth changes
    useEffect(() => {
        if (isAuthenticated() && token) {
            syncLocalStorageToBackend();
        } else {
            // Use localStorage for guests
            setWishlistItems(loadWishlistFromStorage());
            setLoading(false);
        }
    }, [user, token, isAuthenticated]);

    // Save to localStorage only if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            saveWishlistToStorage(wishlistItems);
        }
    }, [wishlistItems, isAuthenticated]);

    const addToWishlist = async (product) => {
        const productId = product.id || product._id;

        if (isAuthenticated() && token) {
            // Use backend API
            try {
                const response = await fetch(`${API_URL}/api/wishlist/${productId}`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setWishlistItems(data.wishlist || []);
                    }
                }
            } catch (error) {
                console.error("Error adding to wishlist:", error);
            }
        } else {
            // Use localStorage
            setWishlistItems((prevItems) => {
                // Check if product already exists in wishlist
                const existingItem = prevItems.find((item) => item.id === productId);
                
                if (existingItem) {
                    // Product already in wishlist, don't add duplicate
                    return prevItems;
                }
                
                return [...prevItems, { ...product, id: productId }];
            });
        }
    };

    const removeFromWishlist = async (itemId) => {
        if (isAuthenticated() && token) {
            // Use backend API
            try {
                const response = await fetch(`${API_URL}/api/wishlist/${itemId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setWishlistItems(data.wishlist || []);
                    }
                }
            } catch (error) {
                console.error("Error removing from wishlist:", error);
            }
        } else {
            // Use localStorage
            setWishlistItems((prevItems) =>
                prevItems.filter((item) => item.id !== itemId)
            );
        }
    };

    const isInWishlist = (itemId) => {
        return wishlistItems.some((item) => item.id === itemId);
    };

    const clearWishlist = async () => {
        if (isAuthenticated() && token) {
            // Use backend API
            try {
                const response = await fetch(`${API_URL}/api/wishlist`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    setWishlistItems([]);
                }
            } catch (error) {
                console.error("Error clearing wishlist:", error);
            }
        } else {
            // Use localStorage
            setWishlistItems([]);
        }
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
                loading,
                fetchWishlistFromBackend,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

