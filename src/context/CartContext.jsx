import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Load cart from localStorage
const loadCartFromStorage = () => {
    try {
        const cartData = localStorage.getItem("groceryCart");
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        return [];
    }
};

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
    try {
        localStorage.setItem("groceryCart", JSON.stringify(cartItems));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
    }
};

export const CartProvider = ({ children }) => {
    const { user, token, isAuthenticated } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const isSyncingRef = useRef(false);

    // Fetch cart from backend when user is authenticated
    const fetchCartFromBackend = async () => {
        if (!token || !isAuthenticated()) return;

        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setCartItems(data.cart || []);
                    // Clear localStorage when using backend
                    localStorage.removeItem("groceryCart");
                }
            }
        } catch (error) {
            console.error("Error fetching cart from backend:", error);
        } finally {
            setLoading(false);
        }
    };

    // Sync localStorage cart to backend on login
    const syncLocalStorageToBackend = async () => {
        if (!token || !isAuthenticated() || isSyncingRef.current) return;

        const localCart = loadCartFromStorage();
        if (localCart.length === 0) {
            fetchCartFromBackend();
            return;
        }

        try {
            isSyncingRef.current = true;
            // Helper function to check if string is a valid MongoDB ObjectId
            const isValidObjectId = (id) => {
                return id && typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);
            };

            // Add each item from localStorage to backend (only if it has a valid ObjectId)
            for (const item of localCart) {
                const productId = item.id || item._id;
                
                // Skip items with invalid ObjectIds (likely hardcoded/test data)
                if (!isValidObjectId(productId)) {
                    console.warn(`Skipping cart item with invalid product ID: ${productId}`);
                    continue;
                }

                const price = typeof item.price === "string" 
                    ? parseFloat(item.price.replace("£", "").replace(",", ""))
                    : item.price;

                try {
                    await fetch(`${API_URL}/api/cart`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            productId: productId,
                            quantity: item.quantity || 1,
                            weight: item.weight || null,
                            price: price,
                        }),
                    });
                } catch (error) {
                    console.error(`Error syncing cart item ${productId}:`, error);
                    // Continue with next item even if one fails
                }
            }

            // Clear localStorage and fetch updated cart from backend
            localStorage.removeItem("groceryCart");
            await fetchCartFromBackend();
        } catch (error) {
            console.error("Error syncing cart to backend:", error);
        } finally {
            isSyncingRef.current = false;
        }
    };

    // Load cart when component mounts or user/auth changes
    useEffect(() => {
        if (isAuthenticated() && token) {
            syncLocalStorageToBackend();
        } else {
            // Use localStorage for guests
            setCartItems(loadCartFromStorage());
            setLoading(false);
        }
    }, [user, token, isAuthenticated]);

    // Save to localStorage only if user is not authenticated
    useEffect(() => {
        if (!isAuthenticated()) {
            saveCartToStorage(cartItems);
        }
    }, [cartItems, isAuthenticated]);

    const addToCart = async (product) => {
        const productId = product.id || product._id;
        const quantity = product.quantity || 1;
        const weight = product.weight || null;
        const price = typeof product.price === "string" 
            ? parseFloat(product.price.replace("£", "").replace(",", ""))
            : product.price;

        if (isAuthenticated() && token) {
            // Use backend API
            try {
                const response = await fetch(`${API_URL}/api/cart`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId,
                        quantity,
                        weight,
                        price,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setCartItems(data.cart || []);
                        setIsCartOpen(true);
                    }
                }
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        } else {
            // Use localStorage
            setCartItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.id === productId && item.weight === weight);
                
                if (existingItem) {
                    return prevItems.map((item) =>
                        item.id === productId && item.weight === weight
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                
                return [...prevItems, { ...product, id: productId, quantity, weight }];
            });
            setIsCartOpen(true);
        }
    };

    const removeFromCart = async (itemId, weight) => {
        if (isAuthenticated() && token) {
            // Use backend API
            try {
                const response = await fetch(`${API_URL}/api/cart/${itemId}?weight=${weight || ""}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setCartItems(data.cart || []);
                    }
                }
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        } else {
            // Use localStorage
            setCartItems((prevItems) =>
                prevItems.filter((item) => !(item.id === itemId && item.weight === weight))
            );
        }
    };

    const updateQuantity = async (itemId, weight, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId, weight);
            return;
        }

        if (isAuthenticated() && token) {
            // Use backend API
            try {
                const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        quantity: newQuantity,
                        weight,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setCartItems(data.cart || []);
                    }
                }
            } catch (error) {
                console.error("Error updating cart quantity:", error);
            }
        } else {
            // Use localStorage
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === itemId && item.weight === weight
                        ? { ...item, quantity: newQuantity }
                        : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (isAuthenticated() && token) {
            // Use backend API
            try {
                const response = await fetch(`${API_URL}/api/cart`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        } else {
            // Use localStorage
            setCartItems([]);
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.price.replace("£", "").replace(",", ""));
            return total + price * item.quantity;
        }, 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getTotalPrice,
                getTotalItems,
                isCartOpen,
                setIsCartOpen,
                loading,
                fetchCartFromBackend,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

