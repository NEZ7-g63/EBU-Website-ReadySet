import clsx from "clsx";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

// Không đặt "focus:outline-none" — cần giữ đúng viền focus chung của site
// (globals.css :focus-visible) để người dùng bấm Tab thấy rõ đang ở ô nào,
// chỉ thêm hiệu ứng đổi màu viền dưới cho đẹp mắt khi focus.
const fieldClass =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-[15px] text-ink placeholder:text-ink-60 focus:border-ink";

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(fieldClass, className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(fieldClass, "resize-none", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={clsx(fieldClass, "cursor-pointer disabled:cursor-not-allowed disabled:opacity-40", className)} {...rest}>
      {children}
    </select>
  );
}
