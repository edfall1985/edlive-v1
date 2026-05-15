"use client";

import { useState, useEffect, useRef } from "react";

export function Timer() {
  const [seconds, setSeconds] = useState(300);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");

  return (
    <span className="text-sm text-secondary">
      ⏱ Timer: <span className="text-lg font-mono font-bold">{mins}:{secs}</span>
    </span>
  );
}
