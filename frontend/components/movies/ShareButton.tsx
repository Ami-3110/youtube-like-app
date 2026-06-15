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

type Props = {
  movieId: number;
  title: string;
};

export function ShareButton({ movieId, title }: Props) {

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);

  function handleShareX() {
    const url = encodeURIComponent(window.location.href);

    window.open(
      `https://twitter.com/intent/tweet?url=${url}`,
      "_blank"
    );
  }

  function handleShareFacebook() {
    const url = encodeURIComponent(window.location.href);

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  }

  function handleShareLine() {
    const url = encodeURIComponent(window.location.href);

    window.open(
      `https://social-plugins.line.me/lineit/share?url=${url}`,
      "_blank"
    );
  }

  function handleShareThreads() {
    const url = encodeURIComponent(window.location.href);

    window.open(
      `https://threads.net/intent/post?url=${url}`,
      "_blank"
    );
  }

  function handleShareMail() {
    const url = encodeURIComponent(window.location.href);

    window.location.href = `mailto:?body=${url}`;
  }

  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollIcons(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  function getCurrentUrl() {
    return window.location.href;
  }

  const [embedCopied, setEmbedCopied] = useState(false);

  function getEmbedUrl() {
    return `${window.location.origin}/embed/movies/${movieId}`;
  }

  function getEmbedCode() {
    return `<iframe
    width="560"
    height="315"
    src="${getEmbedUrl()}"
    title="SeaTube video player"
    frameborder="0"
    allow="autoplay; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowFullScreen
  ></iframe>`;
  }

  async function handleCopyEmbed() {
    await navigator.clipboard.writeText(getEmbedCode());
    setEmbedCopied(true);

    setTimeout(() => {
      setEmbedCopied(false);
    }, 1200);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsEmbedOpen(false);
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
                <button
                  type="button"
                  onClick={() => setIsEmbedOpen(true)}
                  className="flex min-w-20 flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                    <FaCode size={24} />
                  </div>
                  <span className="text-xs">埋め込む</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareX}
                  className="flex min-w-20 flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black">
                    <FaXTwitter size={36} className="text-white" />
                  </div>
                  <span className="text-xs">X</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="flex min-w-20 flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1877F2]">
                    <FaFacebookF size={30} className="text-white" />
                  </div>
                  <span className="text-xs">Facebook</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareLine}
                  className="flex min-w-20 flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500">
                    <FaLine size={40} className="text-white" />
                  </div>
                  <span className="text-xs">LINE</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareThreads}
                  className="flex min-w-20 flex-col items-center gap-2"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                    <RiThreadsFill size={40} className="text-black" />
                  </div>
                  <span className="text-xs">Threads</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareMail}
                  className="flex min-w-20 flex-col items-center gap-2"
                >
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
                {getCurrentUrl()}
              </span>

              <button
                type="button"
                onClick={handleCopy}
                className="ml-4 rounded-full border border-slate-600 px-4 py-2 text-sm hover:bg-slate-800"
              >
                {copied ? "コピーしました" : "コピー"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 埋め込みのモーダル */}
      {isEmbedOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70"
          onClick={() => setIsEmbedOpen(false)}
        >
          <div
            className="grid w-full max-w-6xl overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl md:grid-cols-[3fr_2fr]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 左：プレビュー */}
            <div className="relative min-h-90 bg-black">
              <iframe
                src={getEmbedUrl()}
                className="h-full w-full"
                allowFullScreen
              />

              <div className="absolute left-4 top-4 z-10">
                <h2 className="max-w-xl text-lg font-bold drop-shadow">
                  {title}
                </h2>
              </div>
            </div>
            
            {/* 右：コード欄 */}
            <div className="flex min-h-90 flex-col border border-slate-700">
              <div className="flex items-center justify-between border-b border-slate-700 p-4">
                <h3 className="text-base font-bold">動画の埋め込み</h3>
              
                <button
                  type="button"
                  onClick={() => setIsEmbedOpen(false)}
                  className="rounded-full px-3 py-1 text-slate-300 hover:bg-slate-800"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <pre className="whitespace-pre-wrap text-sm text-slate-300">
                  <code>{getEmbedCode()}</code>
                </pre>
              </div>
              
              <div className="flex justify-end border-t border-slate-700 p-4">
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className="rounded-full border border-slate-600 px-5 py-2 text-sm hover:bg-slate-800"
                >
                  {embedCopied ? "コピーしました" : "コピー"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}  
