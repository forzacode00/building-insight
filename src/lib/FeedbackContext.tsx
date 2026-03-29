import { createContext, useContext, useState, useCallback } from "react";

export interface FeedbackItem {
  id: string;
  timestamp: string;
  page: string;
  type: "forslag" | "feil" | "annet";
  message: string;
  priority: "lav" | "middels" | "høy";
  status: "ny" | "under vurdering" | "implementert" | "avvist";
}

interface FeedbackContextType {
  items: FeedbackItem[];
  addFeedback: (item: Omit<FeedbackItem, "id" | "timestamp" | "status">) => void;
  updateStatus: (id: string, status: FeedbackItem["status"]) => void;
  unreadCount: number;
}

const FeedbackContext = createContext<FeedbackContextType | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FeedbackItem[]>([]);

  const addFeedback = useCallback((item: Omit<FeedbackItem, "id" | "timestamp" | "status">) => {
    const newItem: FeedbackItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: "ny",
    };
    setItems((prev) => [newItem, ...prev]);
  }, []);

  const updateStatus = useCallback((id: string, status: FeedbackItem["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  }, []);

  const unreadCount = items.filter((i) => i.status === "ny").length;

  return (
    <FeedbackContext.Provider value={{ items, addFeedback, updateStatus, unreadCount }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}
