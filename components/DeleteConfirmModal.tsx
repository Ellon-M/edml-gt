// components/DeleteConfirmModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function DeleteConfirmModal({
  open,
  title = "Confirm delete",
  message = "Type the property title below to confirm deletion.",
  requiredText,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  message?: string;
  requiredText?: string; // exact text user must type
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm?: () => Promise<void> | void;
  onCancel?: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setValue("");
      setTouched(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onCancel?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const isMatch = requiredText ? value.trim() === requiredText.trim() : true;
  const showHint = Boolean(requiredText);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div onClick={() => onCancel?.()} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl border p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">{title}</h3>

        <p className="mt-2 text-sm text-gray-600">
          {message}
          {showHint && (
            <span className="block mt-2 text-xs text-gray-500">
              To confirm, type: <span className="font-medium">{requiredText}</span>
            </span>
          )}
        </p>

        {showHint && (
          <div className="mt-4">
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Type property title to confirm"
              className="w-full rounded-md border px-3 py-2"
            />
            {touched && !isMatch && value.length > 0 && (
              <div className="text-xs text-red-600 mt-2">The text does not match exactly.</div>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onCancel?.()}
            className="px-4 py-2 rounded-md border hover:bg-gray-50 text-sm"
            disabled={loading}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={async () => {
              if (!isMatch) return;
              if (onConfirm) await onConfirm();
            }}
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm text-white",
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700",
              !isMatch && "opacity-60 cursor-not-allowed"
            )}
            disabled={loading || !isMatch}
          >
            {loading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.15" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
