import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useScanFeed, type UseScanFeedReturn } from "@/hooks/useScanFeed";

const ScanFeedContext = createContext<UseScanFeedReturn | null>(null);

export const ScanFeedProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const onFound = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["secrets"] });
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  }, [queryClient]);

  const feed = useScanFeed({ onFound });

  return (
    <ScanFeedContext.Provider value={feed}>{children}</ScanFeedContext.Provider>
  );
};

export const useScanFeedContext = (): UseScanFeedReturn => {
  const ctx = useContext(ScanFeedContext);
  if (!ctx)
    throw new Error("useScanFeedContext must be used within ScanFeedProvider");
  return ctx;
};
