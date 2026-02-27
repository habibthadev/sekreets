import { create } from "zustand";
import type { SecretsParams } from "@/lib/api";

interface FilterStore {
  
  params: Pick<SecretsParams, "cursor" | "page">;
  cursorHistory: (string | undefined)[];
  goNext: (nextCursor: string) => void;
  goPrev: () => void;
  
  syncFromUrl: () => void;
  resetFilters: () => void;
}

const defaultParams = { cursor: undefined as string | undefined, page: 1 };

export const useFilterStore = create<FilterStore>((set) => ({
  params: { ...defaultParams },
  cursorHistory: [],

  goNext: (nextCursor) =>
    set((s) => ({
      cursorHistory: [...s.cursorHistory, s.params.cursor],
      params: { cursor: nextCursor, page: (s.params.page ?? 1) + 1 },
    })),

  goPrev: () =>
    set((s) => {
      const history = [...s.cursorHistory];
      const prevCursor = history.pop(); 
      return {
        cursorHistory: history,
        params: {
          cursor: prevCursor,
          page: Math.max(1, (s.params.page ?? 1) - 1),
        },
      };
    }),

  syncFromUrl: () => set({ cursorHistory: [], params: { ...defaultParams } }),

  resetFilters: () => set({ cursorHistory: [], params: { ...defaultParams } }),
}));
