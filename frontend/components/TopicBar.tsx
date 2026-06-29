// frontend/components/TopicBar.tsx
"use client"

import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const topics = [
  "全て",
  "イカ",
  "ウミウシ",
  "カメ",
  "ケーブ",
  "サメ",
  "タコ",
  "ドリフト",
  "ナイト",
  "ビーチ",
  "ボート",
  "マクロ",
  "レック",
  "ワイド",
  "魚群",
  "甲殻類",
  "地形",
  "哺乳類",
];

export default function TopicBar() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function scrollTopics(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateScrollButtons();

    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, []);
  
  return (
    <div className="relative bg-slate-950 px-5 py-3">
      {canScrollLeft && (
      <button
        type="button"
        onClick={()=> scrollTopics("left")}          
        className="absolute left-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 text-slate-300 hover:bg-slate-800"
      >
        <FiChevronLeft size={22} />
      </button>
  )}
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-3 overflow-x-auto"
      >
        {topics.map((topic, index) => (
          <button
            key={topic}
            type="button"
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold ${
              index === 0
                ? "bg-slate-300 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
      
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollTopics("right")}
          className="absolute right-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 text-slate-300 hover:bg-slate-800"
        >
          <FiChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
