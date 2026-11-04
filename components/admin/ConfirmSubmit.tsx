"use client";

import { useFormStatus } from "react-dom";

/** Nút submit hỏi xác nhận trước — dùng trong <form action={serverAction}>. */
export function ConfirmSubmit({ message, children }: { message: string; children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className="text-[12px] text-ink-60 underline underline-offset-2 hover:text-sale disabled:opacity-40"
    >
      {pending ? "Đang xoá…" : children}
    </button>
  );
}
