"use client";
import { useSessionTimeout } from "@/hooks/useSessionTimeout";

export default function SessionTimeout() {
  useSessionTimeout();
  return null;
}
