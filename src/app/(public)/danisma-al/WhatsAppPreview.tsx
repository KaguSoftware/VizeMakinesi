"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function WhatsAppPreview({ message }: { message: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lg:sticky lg:top-28 rounded-2xl overflow-hidden border border-border shadow-[0_24px_48px_-28px_rgba(15,23,42,0.25)] bg-[#ECE5DD]">
      {/* Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-whatsapp flex items-center justify-center text-white font-bold text-[15px] shrink-0">
          VM
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="font-sans font-semibold text-[14px] truncate">Vize Makinesi</span>
          <span className="font-sans text-[11px] text-white/75">çevrimiçi</span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-white/70">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1 1 0 0 0-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.58l2.2-2.21a1 1 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1 17 17 0 0 0 17 17 1 1 0 0 0 1-1v-3.5a1 1 0 0 0-1-1z" />
          </svg>
        </div>
      </div>

      {/* Chat body */}
      <div
        className="relative px-4 py-6 min-h-[420px]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><path d='M0 20h40M20 0v40' stroke='%23d9d3c4' stroke-width='0.4'/></svg>\")",
          backgroundColor: "#ECE5DD",
        }}
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#54656f] mb-4 text-center">
          — Önizleme: WhatsApp&apos;ta görünecek mesaj
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={message.length}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
            className="ml-auto max-w-[88%] bg-[#DCF8C6] rounded-xl rounded-tr-sm px-3.5 py-2.5 shadow-[0_1px_0.5px_rgba(0,0,0,0.13)]"
          >
            <pre className="whitespace-pre-wrap font-sans text-[14px] leading-[1.45] text-[#111b21] break-words">
              {message}
            </pre>
            <div className="flex items-center justify-end gap-1 mt-1.5">
              <span className="font-sans text-[10px] text-[#667781]">{time}</span>
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden="true">
                <path
                  d="M11.071.653a.5.5 0 0 1 .093.701l-5.5 7a.5.5 0 0 1-.736.053L1.5 4.99l.707-.707 3.114 3.114 5.099-6.491a.5.5 0 0 1 .65-.253z"
                  fill="#53BDEB"
                />
                <path
                  d="M15.071.653a.5.5 0 0 1 .093.701l-5.5 7a.5.5 0 0 1-.736.053L5.5 4.99l.707-.707 3.114 3.114 5.099-6.491a.5.5 0 0 1 .65-.253z"
                  fill="#53BDEB"
                />
              </svg>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-white px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted border-t border-border">
        Form WhatsApp&apos;tan gönderilir
      </div>
    </div>
  );
}
