import React, { useState, useMemo } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Download,
    FileText,
    FileSpreadsheet,
} from "lucide-react";

const AdvancedTable = ({
    data = [],
    columns = [],
    title = "Table",
    onRowClick,
    searchable = true,
    exportable = true,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 25, 50, 100],
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter((row) => {
            return columns.some((column) => {
                const value = column.accessor
                    ? (typeof column.accessor === "function"
                          ? column.accessor(row)
                          : row[column.accessor])
                    : "";
                return String(value)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            });
        });
    }, [data, searchTerm, columns]);

    // Paginate data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredData.length / pageSize);

    // Handle page changes
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = columns.map((col) => col.header).join(",");
        const rows = filteredData.map((row) =>
            columns
                .map((col) => {
                    const value = col.accessor
                        ? typeof col.accessor === "function"
                            ? col.accessor(row)
                            : row[col.accessor]
                        : "";
                    // Escape commas and quotes in CSV
                    const stringValue = String(value).replace(/"/g, '""');
                    return `"${stringValue}"`;
                })
                .join(",")
        );

        const csvContent = [headers, ...rows].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `${title}_${new Date().toISOString().split("T")[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Export to PDF
    const exportToPDF = async () => {
        try {
            // Dynamic import of jsPDF
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            // Title
            doc.setFontSize(16);
            doc.text(title, 14, 15);

            // Date
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 22);

            // Table content
            const tableData = [];
            const tableHeaders = columns.map((col) => col.header);

            filteredData.forEach((row) => {
                const rowData = columns.map((col) => {
                    const value = col.accessor
                        ? typeof col.accessor === "function"
                            ? col.accessor(row)
                            : row[col.accessor]
                        : "";
                    return String(value);
                });
                tableData.push(rowData);
            });

            // Simple table rendering
            let yPosition = 30;
            const lineHeight = 7;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 14;
            const maxWidth = doc.internal.pageSize.width - margin * 2;
            const colWidth = maxWidth / columns.length;

            // Headers
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            columns.forEach((col, index) => {
                doc.text(col.header, margin + index * colWidth, yPosition, {
                    maxWidth: colWidth,
                });
            });
            yPosition += lineHeight;

            // Draw header line
            doc.setLineWidth(0.5);
            doc.line(margin, yPosition - 2, doc.internal.pageSize.width - margin, yPosition - 2);

            // Data rows
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9);
            tableData.forEach((row, rowIndex) => {
                // Check if we need a new page
                if (yPosition > pageHeight - 20) {
                    doc.addPage();
                    yPosition = 20;
                }

                columns.forEach((col, colIndex) => {
                    doc.text(row[colIndex] || "", margin + colIndex * colWidth, yPosition, {
                        maxWidth: colWidth,
                    });
                });
                yPosition += lineHeight;
            });

            doc.save(`${title}_${new Date().toISOString().split("T")[0]}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. Please install jsPDF: npm install jspdf");
        }
    };

    // Render cell content
    const renderCell = (row, column) => {
        if (column.render) {
            return column.render(row);
        }

        const value = column.accessor
            ? typeof column.accessor === "function"
                ? column.accessor(row)
                : row[column.accessor]
            : "";

        return value ?? "";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header Section */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-bold text-[#253D4E]">{title}</h2>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        {searchable && (
                            <div className="relative flex-1 sm:flex-initial sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] focus:border-transparent"
                                />
                            </div>
                        )}

                        {/* Export Buttons */}
                        {exportable && (
                            <div className="flex gap-2">
                                <button
                                    onClick={exportToCSV}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#3B745B] text-white rounded-lg hover:bg-[#2a5542] transition-colors text-sm font-medium"
                                    title="Export to CSV"
                                >
                                    <FileSpreadsheet className="h-4 w-4" />
                                    <span className="hidden sm:inline">CSV</span>
                                </button>
                                <button
                                    onClick={exportToPDF}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    title="Export to PDF"
                                >
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">PDF</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {paginatedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                    {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}{" "}
                    {searchTerm && `(filtered from ${data.length} total)`}
                </div>
            </div>

            {/* Table Section - Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    className={`hover:bg-gray-50 transition-colors ${
                                        onRowClick ? "cursor-pointer" : ""
                                    }`}
                                >
                                    {columns.map((column, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="px-4 py-3 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {renderCell(row, column)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center text-gray-500"
                                >
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile/Card View */}
            <div className="md:hidden divide-y divide-gray-200">
                {paginatedData.length > 0 ? (
                    paginatedData.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`p-4 space-y-3 transition-colors ${onRowClick ? "cursor-pointer hover:bg-gray-50 active:bg-gray-100" : ""}`}
                        >
                            {columns.map((column, colIndex) => {
                                // Skip actions column header in mobile view for better UX
                                if (column.header === "Actions") {
                                    return (
                                        <div key={colIndex} className="pt-2 border-t border-gray-100">
                                            <div className="flex items-center justify-start gap-2">
                                                {renderCell(row, column)}
                                            </div>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={colIndex} className="flex flex-col gap-1">
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            {column.header}
                                        </span>
                                        <div className="text-sm text-gray-900 break-words">
                                            {renderCell(row, column)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">No data found</div>
                )}
            </div>

            {/* Pagination Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Page Size Selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Show:</label>
                        <select
                            value={pageSize}
                            onChange={handlePageSizeChange}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B745B] text-sm"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-600">entries</span>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            title="First page"
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            title="Previous page"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <span className="px-4 py-2 text-sm text-gray-700">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            title="Next page"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage >= totalPages}
                            className="p-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            title="Last page"
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedTable;

