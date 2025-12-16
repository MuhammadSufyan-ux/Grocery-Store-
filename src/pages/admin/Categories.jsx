import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, Plus, Edit, Trash2, Loader, Folder, FolderOpen } from "lucide-react";
import AdvancedTable from "../../components/admin/AdvancedTable";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const Categories = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("all"); // "all", "main", "sub"
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Fetch categories from API
    useEffect(() => {
        fetchCategories();
    }, [viewMode]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            let url = `${API_URL}/api/categories`;
            
            if (viewMode === "main") {
                url += "?includeSubCategories=false";
            } else {
                url += "?includeSubCategories=true";
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Transform database categories to table format
                const formattedCategories = data.categories.map((category) => ({
                    id: category._id,
                    name: category.name,
                    type: category.parentCategory ? "Sub-Category" : "Main Category",
                    parentCategory: category.parentCategory?.name || "-",
                    productCount: category.productCount || 0,
                    isActive: category.isActive,
                    image: category.image,
                    order: category.order,
                }));

                // Filter by view mode
                let filteredCategories = formattedCategories;
                if (viewMode === "main") {
                    filteredCategories = formattedCategories.filter((cat) => cat.type === "Main Category");
                } else if (viewMode === "sub") {
                    filteredCategories = formattedCategories.filter((cat) => cat.type === "Sub-Category");
                }

                setCategories(filteredCategories);
            } else {
                error("Failed to fetch categories");
            }
        } catch (err) {
            console.error("Error fetching categories:", err);
            error("Error loading categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId, categoryName) => {
        if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success("Category deleted successfully");
                fetchCategories();
            } else {
                error(data.message || "Failed to delete category");
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            error("Error deleting category. Please try again.");
        }
    };

    const getStatusBadge = (isActive) => {
        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                }`}
            >
                {isActive ? "Active" : "Inactive"}
            </span>
        );
    };

    const handleRowClick = (category) => {
        // Navigate to edit or view details
        console.log("Category clicked:", category);
    };

    const columns = [
        {
            header: "Category",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.image ? (
                        <img
                            src={row.image}
                            alt={row.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = "none";
                            }}
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {row.type === "Sub-Category" ? (
                                <FolderOpen className="h-6 w-6 text-gray-400" />
                            ) : (
                                <Folder className="h-6 w-6 text-gray-400" />
                            )}
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-[#253D4E]">{row.name}</span>
                            <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                    row.type === "Sub-Category"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-purple-100 text-purple-800"
                                }`}
                            >
                                {row.type}
                            </span>
                        </div>
                        {row.parentCategory !== "-" && (
                            <p className="text-xs text-gray-500">Parent: {row.parentCategory}</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            header: "Type",
            accessor: "type",
        },
        {
            header: "Parent",
            accessor: "parentCategory",
        },
        {
            header: "Products",
            accessor: "productCount",
            render: (row) => (
                <span className="text-sm font-medium text-gray-700">{row.productCount}</span>
            ),
        },
        {
            header: "Status",
            accessor: "isActive",
            render: (row) => getStatusBadge(row.isActive),
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/categories/edit/${row.id}`);
                        }}
                        className="p-1.5 text-[#3B745B] hover:bg-green-50 rounded transition-colors"
                        title="Edit"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.id, row.name);
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#253D4E]">Categories</h1>
                    <p className="text-gray-600 mt-1">Manage product categories and sub-categories</p>
                </div>
                <div className="flex gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("all")}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                viewMode === "all"
                                    ? "bg-[#3B745B] text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setViewMode("main")}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                viewMode === "main"
                                    ? "bg-[#3B745B] text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Main
                        </button>
                        <button
                            onClick={() => setViewMode("sub")}
                            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                                viewMode === "sub"
                                    ? "bg-[#3B745B] text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            Sub
                        </button>
                    </div>
                    <button
                        onClick={() => navigate("/admin/categories/create")}
                        className="flex items-center gap-2 bg-[#3B745B] text-white px-4 py-2 rounded-lg hover:bg-[#2a5542] transition-colors font-medium"
                    >
                        <Plus className="h-5 w-5" />
                        Add Category
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Loader className="h-8 w-8 animate-spin text-[#3B745B] mx-auto mb-4" />
                    <p className="text-gray-600">Loading categories...</p>
                </div>
            ) : (
                /* Advanced Table */
                <AdvancedTable
                    data={categories}
                    columns={columns}
                    title="Categories"
                    onRowClick={handleRowClick}
                    searchable={true}
                    exportable={true}
                    defaultPageSize={10}
                    pageSizeOptions={[5, 10, 25, 50, 100]}
                />
            )}
        </div>
    );
};

export default Categories;
