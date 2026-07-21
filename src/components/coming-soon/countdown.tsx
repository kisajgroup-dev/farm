"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";

function diff(target: number) {
  const now = Date.now();
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

export function Countdown({ launchDate }: { launchDate: string | null }) {
  const { t } = useLanguage();
  const target = launchDate ? new Date(launchDate).getTime() : null;
  const [time, setTime] = useState(() => (target ? diff(target) : null));

  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!time) return null;

  const units = [
    { value: time.days, label: t.comingSoon.days },
    { value: time.hours, label: t.comingSoon.hours },
    { value: time.minutes, label: t.comingSoon.minutes },
    { value: time.seconds, label: t.comingSoon.seconds },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
      {units.map((u, i) => (
        <motion.div
          key={u.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i }}
          className="flex min-w-[74px] flex-col items-center rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md sm:min-w-[92px]"
        >
          <span className="font-display text-3xl font-semibold tabular-nums text-white sm:text-4xl">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[11px] uppercase tracking-wider text-white/70">{u.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
