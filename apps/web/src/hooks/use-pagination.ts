"use client";

import { useState } from "react";

export function usePagination() {
    const [currentPage, setCurrentPage] = useState(0);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(0, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => prev + 1);
    };

    const canGoPrevious = currentPage > 0;

    return {
        currentPage,
        handlePreviousPage,
        handleNextPage,
        canGoPrevious,
    };
}
