// frontend/components/TopicBar.tsx
"use client"

import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { Topic } from "@/types/topic";
import { getTopics } from "@/lib/api/topics";

type TopicBarProps = {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
};



export default function TopicBar({
  selectedTopic,
  onSelectTopic,
}: TopicBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const data = await getTopics();
        setTopics(data);
      } catch {
        setTopics([]);
      }
    }

    fetchTopics();
  }, []);

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
  }, [topics]);
  
  return (
    <div className="relative bg-slate-950 px-5 py-3">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollTopics("left")}
          className="absolute left-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950 text-slate-300 hover:bg-slate-800"
        >
          <FiChevronLeft size={22} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-3 overflow-x-auto"
      >
        <button
          type="button"
          onClick={() => onSelectTopic("すべて")}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold ${
            selectedTopic === "すべて"
              ? "bg-white text-slate-950"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          すべて
        </button>

        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.name)}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold ${
              selectedTopic === topic.name
                ? "bg-slate-300 text-slate-950"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {topic.name}
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
