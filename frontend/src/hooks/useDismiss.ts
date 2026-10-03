import { useEffect, type RefObject } from "react";

export function useDismiss<T extends HTMLElement>(
  ref: RefObject<T | null>,
  open: boolean,
  setOpen: (open: boolean) => void,
) {
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const element = ref.current;
      if (element && !event.composedPath().includes(element)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, ref, setOpen]);
}
