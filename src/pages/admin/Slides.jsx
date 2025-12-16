import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Image, Plus, Edit, Trash2, Loader, Eye, EyeOff } from "lucide-react";
import AdvancedTable from "../../components/admin/AdvancedTable";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const Slides = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { token } = useAuth();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/slides`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                const formattedSlides = data.slides.map((slide) => ({
                    id: slide._id,
                    title: slide.title || "Untitled",
                    image: slide.image,
                    alt: slide.alt || "",
                    link: slide.link || "-",
                    order: slide.order || 0,
                    isActive: slide.isActive,
                }));

                setSlides(formattedSlides);
            } else {
                error("Failed to fetch slides");
            }
        } catch (err) {
            console.error("Error fetching slides:", err);
            error("Error loading slides. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (slideId, slideTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${slideTitle}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/slides/${slideId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success("Slide deleted successfully");
                fetchSlides();
            } else {
                error(data.message || "Failed to delete slide");
            }
        } catch (err) {
            console.error("Error deleting slide:", err);
            error("Error deleting slide. Please try again.");
        }
    };

    const handleToggleActive = async (slideId, currentStatus) => {
        try {
            const response = await fetch(`${API_URL}/api/slides/${slideId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive: !currentStatus }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success(`Slide ${!currentStatus ? "activated" : "deactivated"} successfully`);
                fetchSlides();
            } else {
                error(data.message || "Failed to update slide");
            }
        } catch (err) {
            console.error("Error updating slide:", err);
            error("Error updating slide. Please try again.");
        }
    };

    const columns = [
        {
            header: "Image",
            accessor: "image",
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.image ? (
                        <img
                            src={row.image}
                            alt={row.alt || row.title}
                            className="h-16 w-24 object-cover rounded border border-gray-200"
                            onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ddd' width='100' height='100'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                        />
                    ) : (
                        <div className="h-16 w-24 bg-gray-200 rounded flex items-center justify-center">
                            <Image className="h-6 w-6 text-gray-400" />
                        </div>
                    )}
                </div>
            ),
        },
        {
            header: "Title",
            accessor: "title",
        },
        {
            header: "Alt Text",
            accessor: "alt",
            render: (row) => row.alt || "-",
        },
        {
            header: "Link",
            accessor: "link",
            render: (row) => (
                <span className="text-xs text-gray-600 truncate max-w-[150px] block">
                    {row.link || "-"}
                </span>
            ),
        },
        {
            header: "Order",
            accessor: "order",
        },
        {
            header: "Status",
            accessor: "isActive",
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        row.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                >
                    {row.isActive ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(row.id, row.isActive);
                        }}
                        className={`p-1.5 rounded transition-colors ${
                            row.isActive
                                ? "text-gray-600 hover:bg-gray-100"
                                : "text-green-600 hover:bg-green-50"
                        }`}
                        title={row.isActive ? "Deactivate" : "Activate"}
                    >
                        {row.isActive ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/slides/edit/${row.id}`);
                        }}
                        className="p-1.5 text-[#3B745B] hover:bg-green-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.id, row.title);
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader className="h-8 w-8 animate-spin text-[#3B745B] mx-auto mb-4" />
                    <p className="text-gray-600">Loading slides...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#253D4E]">Slides Manager</h1>
                    <p className="text-gray-600 mt-1">
                        Manage home page slider images and responsive settings
                    </p>
                </div>
                <button
                    onClick={() => navigate("/admin/slides/create")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Add New Slide
                </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> If no slides are added, the default hardcoded slides will be
                    displayed on the home page. Once you add slides, only the uploaded slides will be shown.
                </p>
            </div>

            {/* Table */}
            {slides.length > 0 ? (
                <AdvancedTable data={slides} columns={columns} />
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No slides found</h3>
                    <p className="text-gray-600 mb-6">
                        Get started by creating your first slide for the home page.
                    </p>
                    <button
                        onClick={() => navigate("/admin/slides/create")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Slide
                    </button>
                </div>
            )}
        </div>
    );
};

export default Slides;

