import { useEffect, useRef, useState, useCallback } from "react";
import { SSE_URL } from "@/lib/api";

const MAX_ITEMS = 5; // always keep exactly this many slots visible

export type FeedEventType = "scanning" | "found" | "done" | "error";

export interface FeedItem {
  id: string;
  type: FeedEventType;
  repo: string;
  file?: string;
  repoUrl?: string;
  fileUrl?: string;
  provider?: string;
  patternName?: string;
  maskedValue?: string;
  entropy?: number;
  lineNumber?: number | null;
  total?: number;
  message?: string;
  ts: number;
}

export interface UseScanFeedOptions {
  onFound?: () => void;
}

export interface UseScanFeedReturn {
  items: FeedItem[];
  isConnected: boolean;
  foundCount: number;
  clear: () => void;
}

let idCounter = 0;
const uid = () => `feed-${Date.now()}-${++idCounter}`;

export const useScanFeed = (
  options: UseScanFeedOptions = {},
): UseScanFeedReturn => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [foundCount, setFoundCount] = useState(0);

  const onFoundRef = useRef(options.onFound);
  onFoundRef.current = options.onFound;

  const pushItem = useCallback((item: Omit<FeedItem, "id" | "ts">) => {
    const full: FeedItem = { ...item, id: uid(), ts: Date.now() };
    setItems((prev) => [full, ...prev].slice(0, MAX_ITEMS));
  }, []);

  useEffect(() => {
    const es = new EventSource(SSE_URL);

    es.addEventListener("connected", () => setIsConnected(true));
    es.addEventListener("ping", () => void 0);

    es.addEventListener("scanning", (e: MessageEvent) => {
      const data = JSON.parse(e.data) as {
        repo: string;
        file: string;
        query: string;
      };
      pushItem({ type: "scanning", repo: data.repo, file: data.file });
    });

    es.addEventListener("found", (e: MessageEvent) => {
      const data = JSON.parse(e.data) as {
        repo: string;
        repoUrl: string;
        file: string;
        fileUrl: string;
        provider: string;
        patternName: string;
        maskedValue: string;
        entropy: number;
        lineNumber: number | null;
      };
      pushItem({
        type: "found",
        repo: data.repo,
        repoUrl: data.repoUrl,
        file: data.file,
        fileUrl: data.fileUrl,
        provider: data.provider,
        patternName: data.patternName,
        maskedValue: data.maskedValue,
        entropy: data.entropy,
        lineNumber: data.lineNumber,
      });
      setFoundCount((n) => n + 1);
      onFoundRef.current?.();
    });

    es.addEventListener("done", (e: MessageEvent) => {
      const data = JSON.parse(e.data) as { total: number; jobId: string };
      pushItem({ type: "done", repo: "", total: data.total });
    });

    es.addEventListener("error", (e: Event) => {
      if (e instanceof MessageEvent) {
        const data = JSON.parse(e.data) as { message: string };
        pushItem({ type: "error", repo: "", message: data.message });
      }
      setIsConnected(false);
    });

    es.onerror = () => setIsConnected(false);

    return () => es.close();
  }, [pushItem]);

  const clear = useCallback(() => {
    setItems([]);
    setFoundCount(0);
  }, []);

  return { items, isConnected, foundCount, clear };
};
