import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CachedTag {
    id: string;
    name: string;
    color: string;
}

interface ShareTagState {
    // key: token, value: Map<tagId, CachedTag>
    cachedTagsByToken: Map<string, Map<string, CachedTag>>;

    addCachedTag: (token: string, tag: CachedTag) => void;

    removeCachedTag: (token: string, tagId: string) => void;

    getCachedTags: (token: string) => CachedTag[];

    clearCachedTags: (token: string) => void;
}

export const useShareTagStore = create<ShareTagState>()(
    persist(
        (set, get) => ({
            cachedTagsByToken: new Map(),

            addCachedTag: (token, tag) => {
                set((state) => {
                    const newMap = new Map(state.cachedTagsByToken);
                    const tokenTags = newMap.get(token) ?? new Map();
                    tokenTags.set(tag.id, tag);
                    newMap.set(token, tokenTags);
                    return { cachedTagsByToken: newMap };
                });
            },

            removeCachedTag: (token, tagId) => {
                set((state) => {
                    const newMap = new Map(state.cachedTagsByToken);
                    const tokenTags = newMap.get(token);
                    if (tokenTags) {
                        tokenTags.delete(tagId);
                        newMap.set(token, tokenTags);
                    }
                    return { cachedTagsByToken: newMap };
                });
            },

            getCachedTags: (token) => {
                console.log()
                const tokenTags = get().cachedTagsByToken.get(token);
                return tokenTags ? Array.from(tokenTags.values()) : [];
            },

            clearCachedTags: (token) => {
                set((state) => {
                    const newMap = new Map(state.cachedTagsByToken);
                    newMap.delete(token);
                    return { cachedTagsByToken: newMap };
                });
            },
        }),
        {
            name: "share-tag-store",
            storage: {
                getItem: (name) => {
                    const value = sessionStorage.getItem(name);
                    if (!value) return { cachedTagsByToken: new Map() };

                    const parsedValue = JSON.parse(value);
                    return {
                        ...parsedValue.state,
                        cachedTagsByToken: new Map(parsedValue.state.cachedTagsByToken),
                    }
                },
                setItem: (name, value) => {
                    const stringifiedValue = JSON.stringify(value);
                    sessionStorage.setItem(name, stringifiedValue);
                },
                removeItem: (name) => {
                    sessionStorage.removeItem(name);
                },
            },
        },
    ),
);
