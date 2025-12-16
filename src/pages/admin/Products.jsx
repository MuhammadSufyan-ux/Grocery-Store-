import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Edit, Trash2, Eye, Loader } from "lucide-react";
import AdvancedTable from "../../components/admin/AdvancedTable";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const Products = () => {
    const navigate = useNavigate();
    const { success, error } = useToast();
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    // Fetch products from API
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/products?limit=1000`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Transform database products to table format
                const formattedProducts = data.products.map((product) => ({
                    id: product._id,
                    name: product.name,
                    category: product.category,
                    price: `£${product.salePrice.toFixed(2)}`,
                    stock: product.stock?.trackQuantity ? product.stock.quantity : (product.stock?.inStock ? "In Stock" : 0),
                    status: product.status,
                    rating: product.rating || 0,
                    image: product.image,
                }));
                setProducts(formattedProducts);
            } else {
                error("Failed to fetch products");
            }
        } catch (err) {
            console.error("Error fetching products:", err);
            error("Error loading products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId, productName) => {
        if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (response.ok && data.success) {
                success("Product deleted successfully");
                // Refresh products list
                fetchProducts();
            } else {
                error(data.message || "Failed to delete product");
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            error("Error deleting product. Please try again.");
        }
    };

    const handleRowClick = (product) => {
        console.log("Product clicked:", product);
        // Navigate to product detail or open edit modal
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: "bg-green-100 text-green-800", label: "Active" },
            out_of_stock: { color: "bg-red-100 text-red-800", label: "Out of Stock" },
            inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
        };

        const config = statusConfig[status] || statusConfig.inactive;

        return (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
            >
                {config.label}
            </span>
        );
    };

    const getRatingStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
                        ★
                    </span>
                ))}
                <span className="ml-1 text-xs text-gray-500">({rating})</span>
            </div>
        );
    };

    const columns = [
        {
            header: "Product Name",
            accessor: "name",
            render: (row) => (
                <div className="flex items-center gap-2">
                    {row.image ? (
                        <img
                            src={row.image}
                            alt={row.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "";
                                e.target.style.display = "none";
                            }}
                        />
                    ) : null}
                    {!row.image && (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package className="h-5 w-5 text-gray-400" />
                        </div>
                    )}
                    <span className="font-medium text-[#253D4E]">{row.name}</span>
                </div>
            ),
        },
        {
            header: "Category",
            accessor: "category",
        },
        {
            header: "Price",
            accessor: "price",
            render: (row) => <span className="font-semibold text-[#3B745B]">{row.price}</span>,
        },
        {
            header: "Stock",
            accessor: "stock",
            render: (row) => (
                <span className={row.stock === 0 ? "text-red-600 font-medium" : "text-gray-900"}>
                    {row.stock}
                </span>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => getStatusBadge(row.status),
        },
        {
            header: "Rating",
            accessor: "rating",
            render: (row) => getRatingStars(row.rating),
        },
        {
            header: "Actions",
            accessor: "actions",
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("View:", row.id);
                        }}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="View"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log("Edit:", row.id);
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
                    <h1 className="text-3xl font-bold text-[#253D4E]">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your store products</p>
                </div>
                <button
                    onClick={() => navigate("/admin/products/create")}
                    className="flex items-center gap-2 bg-[#3B745B] text-white px-4 py-2 rounded-lg hover:bg-[#2a5542] transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Add Product
                </button>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Loader className="h-8 w-8 animate-spin text-[#3B745B] mx-auto mb-4" />
                    <p className="text-gray-600">Loading products...</p>
                </div>
            ) : (
                /* Advanced Table */
                <AdvancedTable
                    data={products}
                    columns={columns}
                    title="Products"
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

export default Products;
