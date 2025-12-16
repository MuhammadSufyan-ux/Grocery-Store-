import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token"));

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    const fetchUser = async (authToken = token) => {
        if (!authToken) {
            setLoading(false);
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // Token is invalid
                logout();
            }
        } catch (error) {
            console.error("Error fetching user:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    // Check if user is authenticated on mount and when token changes
    useEffect(() => {
        if (token) {
            fetchUser(token);
        } else {
            setLoading(false);
            setUser(null);
        }
    }, [token]); // Run when token changes

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const newToken = data.token;
                setToken(newToken);
                localStorage.setItem("token", newToken);
                // Fetch user with new token
                await fetchUser(newToken);
                return { success: true, message: "Login successful", user: data.user };
            } else {
                return { success: false, message: data.message || "Login failed" };
            }
        } catch (error) {
            console.error("Login error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    const register = async (userData) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const newToken = data.token;
                setToken(newToken);
                localStorage.setItem("token", newToken);
                // Fetch user with new token
                await fetchUser(newToken);
                return { success: true, message: "Registration successful", user: data.user };
            } else {
                return { success: false, message: data.message || "Registration failed" };
            }
        } catch (error) {
            console.error("Registration error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return { success: true, message: data.message || "Password reset email sent" };
            } else {
                return { success: false, message: data.message || "Failed to send reset email" };
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                return { success: true, message: data.message || "Password reset successful" };
            } else {
                return { success: false, message: data.message || "Password reset failed" };
            }
        } catch (error) {
            console.error("Reset password error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await fetch(`${API_URL}/api/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Update user state with new data
                setUser(data.user);
                return { success: true, message: "Profile updated successfully", user: data.user };
            } else {
                return { success: false, message: data.message || "Failed to update profile" };
            }
        } catch (error) {
            console.error("Update profile error:", error);
            return { success: false, message: "Network error. Please try again." };
        }
    };

    const isAdmin = () => {
        return user && user.role === "admin";
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                forgotPassword,
                resetPassword,
                updateProfile,
                isAuthenticated,
                isAdmin,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

