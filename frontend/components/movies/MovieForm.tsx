// frontend/components/movies/MovieForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { uploadMovie } from "@/lib/api/movies";
import { getTopics } from "@/lib/api/topics";
import { AiOutlineCloudUpload } from "react-icons/ai";
import type { Topic } from "@/types/topic";

export default function MovieForm() {
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(""); 
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState("");
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const data = await getTopics();

        const sortedTopics = data.sort((a, b) =>
          a.name.localeCompare(b.name, "ja")
        );
      
        setTopics(sortedTopics);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTopics();
  }, []);

  function toggleTopic(topicId: number) {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  }

  function handleVideoFile(file: File) {
    if (!file.type.startsWith("video/")) {
      alert("動画ファイルを選択してください");
      return;
    }

    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  }

  function handleThumbnailFile(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreviewUrl(URL.createObjectURL(file));
  }

  function handleVideoDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file) {
      handleVideoFile(file);
    }
  }

  function handleThumbnailDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (file) {
      handleThumbnailFile(file);
    }
  }

  function clearVideo() {
    setVideoFile(null);
    setVideoPreviewUrl("");
  }

  function clearThumbnail() {
    setThumbnailFile(null);
    setThumbnailPreviewUrl("");
  }

  function generateThumbnail() {
    const video = videoRef.current;

    if (!video || !videoFile) {
      alert("先に動画ファイルを選択してください");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    if (!context) {
      alert("サムネイルの生成に失敗しました");
      return;
    }
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) {
        alert("サムネイルの生成に失敗しました");
        return;
      }

      const file = new File([blob], "thumbnail.jpg", {
        type: "image/jpeg",
      });

      setThumbnailFile(file);
      setThumbnailPreviewUrl(URL.createObjectURL(file));
    }, "image/jpeg");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) {
      alert("タイトルを入力してください");
      return;
    }

    if (!videoFile) {
      alert("動画ファイルを選択してください");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("movie", videoFile);

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    selectedTopicIds.forEach((topicId, index) => {
      formData.append(`topic_ids[${index}]`, String(topicId));
    });

    try {
      const result = await uploadMovie(formData);
      alert("動画を投稿しました");

      router.push(`/movies/${result.id}`);
    } catch (error) {
      console.error(error);
      alert("動画の投稿に失敗しました");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="w-full max-w-6xl rounded-xl bg-slate-900 p-5 text-white shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">動画を投稿</h2>
          <button
            type="button"
            className="rounded-full px-3 py-1 text-2xl text-slate-300 hover:bg-slate-800"
          >
            ×
          </button>
        </div>

        <div className="my-4 border-b border-slate-700" />

        <div className="mt-6 flex gap-8">
          <div className="flex-1">
            <div className="rounded-lg mb-6 border border-slate-600">
              <label className="text-xs text-slate-500 mb-4 p-1">
                タイトル（必須）
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent p-2 text-lg text-slate-200 outline-none"
              />
            </div>

            <div className="rounded-lg mb-6 border border-slate-600">
              <label className="text-xs text-slate-500 p-1 items-start">
                説明
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent p-2 text-sm text-slate-200 outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-slate-500 p-1 items-start">
                サムネイル
              </label>

              <div className="flex gap-4">
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleThumbnailFile(file);
                    }
                  }}
                />

                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  onDrop={handleThumbnailDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="flex aspect-video flex-1 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-600 text-sm text-slate-400 hover:border-slate-400 hover:text-slate-300"
                >
                  {thumbnailPreviewUrl ? (
                    <div className="relative h-full w-full">
                      <img
                        src={thumbnailPreviewUrl}
                        alt="サムネイルプレビュー"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearThumbnail();
                        }}
                        className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white  hover:bg-black"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    "ファイルをアップロード"
                  )}
                </div>

                <div
                  onClick={generateThumbnail}
                  className="flex aspect-video flex-1 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-slate-600 text-sm text-slate-400 hover:border-slate-400 hover:text-slate-300"
                >
                  {thumbnailPreviewUrl ? (
                    <div className="relative h-full w-full">
                      <img
                        src={thumbnailPreviewUrl}
                        alt="自動生成サムネイル"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearThumbnail();
                        }}
                        className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    "自動生成"
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-96 shrink-0">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleVideoFile(file);
                }
              }}
            />

            <div
              onClick={() => videoInputRef.current?.click()}
              onDrop={handleVideoDrop}
              onDragOver={(e) => e.preventDefault()}
              className="flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-600 text-slate-500 hover:border-slate-400 hover:text-slate-300"
            >
              {videoPreviewUrl ? (
                <div className="relative h-full w-full">
                  <video
                    ref={videoRef}
                    src={videoPreviewUrl}
                    controls
                    onClick={(e) => e.stopPropagation()}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearVideo();
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <AiOutlineCloudUpload size={60} />
                  <p>動画ファイルをアップロード</p>
                </>
              )}
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs text-slate-500">Topic</p>

              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => {
                  const isSelected = selectedTopicIds.includes(topic.id);

                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => toggleTopic(topic.id)}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        isSelected
                          ? "border-slate-400 bg-slate-400 text-slate-900"
                          : "border-slate-500 text-slate-500 hover:bg-slate-500/50"
                      }`}
                    >
                      {topic.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-full bg-slate-400 px-4 py-2 text-sm text-slate-900 hover:bg-slate-300"
          >
            投稿
          </button>
        </div>
      </div>
    </form>
  );
}
