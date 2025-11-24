import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getSearchUsersQuery } from "@/react-query/queries/user";

interface UseUserSearchProps {
    debouncedMs: number;
    limit?: number;
}

export function useUserSearch({
    debouncedMs = 300,
    limit = 10,
}: UseUserSearchProps) {
    const [searchInput, setSearchInput] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchInput);
        }, debouncedMs);

        return () => clearTimeout(timer);
    }, [searchInput, debouncedMs]);

    const searchParams = useMemo(
        () => ({
            query: debouncedQuery,
            limit,
            page: 1,
        }),
        [debouncedQuery, limit],
    );

    const { data, isLoading, isFetching, error } = useQuery({
        ...getSearchUsersQuery(searchParams),
        enabled: !!debouncedQuery,
    });

    const users = useMemo(() => {
        return data?.data || [];
    }, [data]);

    const clearSearch = () => {
        setSearchInput("");
        setDebouncedQuery("");
    };

    const isSearchActive = debouncedQuery.length > 0;

    return {
        searchInput,
        setSearchInput,

        query: debouncedQuery,
        isSearchActive,
        clearSearch,

        users,

        isLoading: isLoading || (isSearchActive && isFetching),
        isSearching: isFetching,
        error,

        hasResults: users.length > 0,
        resultsCount: data?.pagination?.total || 0,
    };
}
