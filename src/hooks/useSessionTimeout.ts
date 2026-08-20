"use client";
import { useEffect, useRef, useCallback } from "react";
import { signOut } from "next-auth/react";

const ACTIVITY_EVENTS = ["mousedown", "keydown", "scroll", "touchstart"] as const;
const CHECK_INTERVAL = 30_000;

export function useSessionTimeout() {
  const lastActivity = useRef(Date.now());
  const maxAge = useRef<number>(0);

  const resetActivity = useCallback(() => {
    lastActivity.current = Date.now();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sessionStart");
    localStorage.removeItem("sessionMaxAge");
    signOut({ callbackUrl: "/signin" });
  }, []);

  useEffect(() => {
    const storedMaxAge = localStorage.getItem("sessionMaxAge");
    const storedStart = localStorage.getItem("sessionStart");

    if (!storedMaxAge || !storedStart) return;

    maxAge.current = Number(storedMaxAge);
    const startTime = Number(storedStart);

    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed >= maxAge.current) {
      logout();
      return;
    }

    lastActivity.current = Date.now();

    const handleActivity = () => {
      lastActivity.current = Date.now();
    };

    ACTIVITY_EVENTS.forEach((event) =>
      document.addEventListener(event, handleActivity, { passive: true }),
    );

    const interval = setInterval(() => {
      const now = Date.now();
      const idleSeconds = (now - lastActivity.current) / 1000;
      const sessionSeconds = (now - startTime) / 1000;

      if (idleSeconds >= 3600 || sessionSeconds >= maxAge.current) {
        logout();
      }
    }, CHECK_INTERVAL);

    return () => {
      ACTIVITY_EVENTS.forEach((event) =>
        document.removeEventListener(event, handleActivity),
      );
      clearInterval(interval);
    };
  }, [logout]);
}
