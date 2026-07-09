"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import React from "react";
import { useLocale } from "@/context/LocaleContext";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: "primary" | "danger";
  loading?: boolean;
  children?: React.ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = "primary",
  loading = false,
  children,
}: ConfirmDialogProps) {
  const { t } = useLocale();
  const resolvedConfirmText = confirmText ?? t.common.confirm;
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[400px] p-6">
      <div className="text-center">
        <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
          {title}
        </h3>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          {message}
        </p>
        {children}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {t.common.cancel}
          </Button>
          <Button
            variant={variant === "danger" ? "primary" : "primary"}
            className={`flex-1 ${variant === "danger" ? "bg-error-500 hover:bg-error-600" : ""}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t.common.processing : resolvedConfirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
