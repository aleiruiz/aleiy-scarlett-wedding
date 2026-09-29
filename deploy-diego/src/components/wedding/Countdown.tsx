"use client";

import { useEffect, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(target: string): TimeLeft {
  const distance = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

export function Countdown({ target }: { target: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(calculateTimeLeft(target));
    update();
    const interval = window.setInterval(update, 1_000);
    return () => window.clearInterval(interval);
  }, [target]);

  if (!timeLeft) {
    return <div className="h-24" aria-hidden="true" />;
  }

  const items = [
    ["Días", timeLeft.days],
    ["Horas", timeLeft.hours],
    ["Min", timeLeft.minutes],
    ["Seg", timeLeft.seconds],
  ] as const;

  return (
    <div className="countdown-grid" aria-label="Cuenta regresiva para la boda">
      {items.map(([label, value]) => (
        <div key={label} className="countdown-item">
          <span className="countdown-number">{String(value).padStart(2, "0")}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
