"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { company } from "@/lib/data/company";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function ContactForm() {
  const { dict: t } = useLocale();
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Không gửi lên server — mở ứng dụng email của người dùng với nội dung đã soạn.
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent("Ready Set")}&body=${encodeURIComponent(message)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Textarea required rows={4} placeholder={t.contact.messageContent} value={message} onChange={(e) => setMessage(e.target.value)} />
      <p className="text-[12px] text-ink-60">{t.contact.mailtoHint}</p>
      <Button type="submit" className="px-8">
        {t.contact.submit}
      </Button>
    </form>
  );
}
