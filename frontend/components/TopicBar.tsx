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
    <div className="relative bg-(--surface-0) px-4 py-3 sm:px-5">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollTopics("left")}
          className="absolute left-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-(--border) bg-(--surface-1) text-(--text-main) hover:bg-(--surface-3)"
        >
          <FiChevronLeft size={22} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto sm:gap-3"
      >
        <button
          type="button"
          onClick={() => onSelectTopic("すべて")}
          className={`shrink-0 rounded-lg border border-(--border) px-3 py-2 text-sm font-bold sm:px-4 ${
            selectedTopic === "すべて"
              ? "bg-(--accent) text-(--accent-text)"
              : "bg-(--surface-2) text-(--text-main) hover:bg-(--surface-3)"
          }`}
        >
          すべて
        </button>

        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => onSelectTopic(topic.name)}
            className={`shrink-0 rounded-lg border border-(--border) px-3 py-2 text-sm font-bold sm:px-4 ${
              selectedTopic === topic.name
                ? "bg-(--accent) text-(--accent-text)"
                : "bg-(--surface-2) text-(--text-main) hover:bg-(--surface-3)"
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
          className="absolute right-0 top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-(--border) bg-(--surface-1) text-(--text-main) hover:bg-(--surface-3)"
        >
          <FiChevronRight size={22} />
        </button>
      )}
    </div>
  );
}
