// frontend/components/movies/MovieForm.tsx
"use client";

import { AiOutlineCloudUpload } from "react-icons/ai";

export default function MovieForm() {
  return (
    <>
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
              <input className="w-full p-2 text-lg text-slate-200"></input>
            </div>

            <div className="rounded-lg mb-6 border border-slate-600">
              <label className="text-xs text-slate-500 p-1 items-start">
                説明
              </label>
              <textarea
                rows={5}
                className="w-full p-2 text-sm text-slate-200"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs text-slate-500 p-1 items-start">
                サムネイル
              </label>

              <div className="flex gap-4">
                <button
                  type="button"
                  className="flex aspect-video flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-600 text-sm text-slate-400 hover:border-slate-400 hover:text-slate-300"
                >
                  ファイルをアップロード
                </button>
                <button
                  type="button"
                  className="flex aspect-video flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-600 text-sm text-slate-400 hover:border-slate-400 hover:text-slate-300"
                >
                  自動生成
                </button>
              </div>
            </div>
          </div>

          <div className="w-96 shrink-0">
            <div className="flex aspect-video flex-col items-center justify-center rounded-xl border border-slate-600 text-slate-500">
              <AiOutlineCloudUpload size={60} />
              <p>動画ファイルをアップロード</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="rounded-full px-4 py-2 bg-slate-400 text-sm text-slate-900">
            投稿
          </button>
        </div>

      </div>
    </>
  );
}




