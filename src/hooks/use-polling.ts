"use client";

import { useEffect, useRef } from "react";

export function usePolling(
  callback: () => void,
  intervalMs: number,
  enabled: boolean = true,
) {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    savedCallback.current();
    intervalRef.current = setInterval(() => savedCallback.current(), intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs, enabled]);
}
