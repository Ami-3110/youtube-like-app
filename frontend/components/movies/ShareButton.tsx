// frontend/components/movies/ShareButton.tsx
"use client";

import { useState } from "react";

export function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      className="rounded-full bg-slate-800 px-4 py-2 hover:bg-slate-700"
    >
      {copied ? "コピーしました" : "共有"}
    </button>
  );
}
