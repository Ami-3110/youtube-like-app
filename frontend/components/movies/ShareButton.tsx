// frontend/components/movies/ShareButton.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { FaCode } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import { FaLine } from "react-icons/fa";
import { RiThreadsFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";



export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollIcons(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-slate-800 px-4 py-2 hover:bg-slate-700"
      >
        共有
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 p-5 text-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">共有</h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full px-3 py-1 text-slate-300 hover:bg-slate-800"
              >
                ×
              </button>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => scrollIcons("left")}
                className="absolute left-0 top-3 z-10 flex h-10 w-10 -translate-x-3 items-center justify-center rounded-full bg-black/60 text-2xl hover:bg-black/80 hover:border border-gray-500"
              >
                <FaChevronLeft size={20} />
              </button>

              <div
                ref={scrollRef}
                className="flex overflow-x-auto pb-2 text-sm [scrollbar-none] [&::-webkit-scrollbar]:hidden"
              >
                <button className="flex min-w-20 flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                    <FaCode size={24} />
                  </div>
                  <span className="text-xs">埋め込む</span>
                </button>

                <button className="flex min-w-20 flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black">
                    <FaXTwitter size={36} className="text-white" />
                  </div>
                  <span className="text-xs">X</span>
                </button>

                <button className="flex min-w-20 flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2]">
                    <FaFacebookF size={30} className="text-white" />
                  </div>
                  <span className="text-xs">Facebook</span>
                </button>

                <button className="flex min-w-20 flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
                    <FaLine size={40} className="text-white" />
                  </div>
                  <span className="text-xs">LINE</span>
                </button>

                <button className="flex min-w-20 flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <RiThreadsFill size={40} className="text-black" />
                  </div>
                  <span className="text-xs">Threads</span>
                </button>

                <button className="flex min-w-20 flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-600">
                    <MdEmail size={36} />
                  </div>
                  <span className="text-xs">メール</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => scrollIcons("right")}
                className="absolute right-6 top-3 z-10 flex h-10 w-10 translate-x-3 items-center justify-center rounded-full bg-black/60 text-2xl hover:bg-black/80 hover:border border-gray-500"
              >
                <FaChevronRight size={20} />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
              <span className="truncate text-sm text-slate-300">
                {window.location.href}
              </span>

              <button
                type="button"
                className="ml-4 rounded-full border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
              >
                コピー
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}  
