"use client";
import React from "react";

interface DropdownItemProps {
  children: React.ReactNode;
  className?: string;
  tag?: "a" | "button" | "div";
  href?: string;
  onItemClick?: () => void;
}

export function DropdownItem({
  children,
  className = "",
  tag = "div",
  href,
  onItemClick,
}: DropdownItemProps) {
  const handleClick = () => {
    onItemClick?.();
  };

  if (tag === "a") {
    return (
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
    );
  }

  if (tag === "button") {
    return (
      <button className={className} onClick={handleClick}>
        {children}
      </button>
    );
  }

  return <div className={className}>{children}</div>;
}
