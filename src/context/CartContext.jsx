import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

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
    const [cartItems, setCartItems] = useState(loadCartFromStorage);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Save to localStorage whenever cartItems change
    useEffect(() => {
        saveCartToStorage(cartItems);
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id && item.weight === product.weight);
            
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id && item.weight === product.weight
                        ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                        : item
                );
            }
            
            return [...prevItems, { ...product, quantity: product.quantity || 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (itemId, weight) => {
        setCartItems((prevItems) =>
            prevItems.filter((item) => !(item.id === itemId && item.weight === weight))
        );
    };

    const updateQuantity = (itemId, weight, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId, weight);
            return;
        }
        
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === itemId && item.weight === weight
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
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
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

