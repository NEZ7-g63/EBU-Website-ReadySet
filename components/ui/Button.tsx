import Link from "next/link";
import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "text";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 h-12 px-6 text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-60",
  ghost: "border border-ink text-ink bg-transparent hover:bg-ink hover:text-white",
  text: "h-auto px-0 underline underline-offset-4 decoration-1 hover:text-ink-60",
};

export function Button({
  variant = "primary",
  className,
  children,
  fullWidth,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clsx(base, variants[variant], fullWidth && "w-full", className)} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  className,
  children,
  fullWidth,
  href,
  onClick,
  ...rest
}: CommonProps & { href: string; onClick?: () => void } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "onClick" | "children">) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(base, variants[variant], fullWidth && "w-full", className)}
      {...rest}
    >
      {children}
    </Link>
  );
}
