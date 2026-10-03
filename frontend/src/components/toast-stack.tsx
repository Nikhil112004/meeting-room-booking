"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export type ToastItem = {
  id: number;
  message: string;
  kind: "success" | "error" | "info";
};

export function ToastStack({
  items,
  dismiss,
}: {
  items: ToastItem[];
  dismiss: (id: number) => void;
}) {
  return (
    <div className="toast-stack">
      <AnimatePresence>
        {items.map((toast) => {
          const Icon =
            toast.kind === "success"
              ? CheckCircle2
              : toast.kind === "error"
                ? AlertCircle
                : Info;
          return (
            <motion.div
              key={toast.id}
              role="status"
              className={`toast toast-${toast.kind}`}
              initial={{ opacity: 0, x: 28, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <Icon size={19} />
              <p>{toast.message}</p>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
