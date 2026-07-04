# SeaTube

Laravel（API）とNext.js（App Router）で構築したYouTube風動画共有アプリです。

---

## デモ

## デモ

- Frontend: https://youtube-like-app-five.vercel.app
- Backend: https://youtube-like-app-production.up.railway.app

### デモアカウント

一般ユーザー

- Email: demouser1@sample.com
- Password: password

管理者

- Email: admin@sample.com
- Password: password

※ Google OAuth（SSO）にも対応しています。

---

## 概要

本アプリは、動画投稿・視聴・コメント・チャンネル登録など、動画共有サービスの主要機能を備えたフルスタックアプリケーションです。

認証にはLaravel Sanctumを採用し、通常ログインに加えてGoogle OAuth（SSO）にも対応しています。

また、テーマ切り替えや管理画面、動画アップロードなど、実際のWebサービスを意識した設計・実装を行いました。

デモ環境には動画・コメント・リアクション・チャンネル登録などのサンプルデータを用意しているため、ログイン後すぐに各機能をお試しいただけます。

---

## 使用技術

### バックエンド

- Laravel 12
- Laravel Sanctum（認証）
- Laravel Socialite（Google OAuth）
- SQLite

### フロントエンド

- Next.js 16（App Router）
- TypeScript
- Tailwind CSS

### インフラ

- Vercel（Frontend）
- Railway（Backend）

---

## 主な機能

### 動画

- 動画一覧
- 動画詳細表示
- 動画アップロード
- 動画編集・削除
- サムネイルアップロード
- 再生回数カウント
- おすすめ動画表示

### コメント

- コメント投稿
- コメント編集・削除
- コメント返信
- コメントへのいいね

### リアクション

- 動画への高評価・低評価
- コメントへのいいね

### チャンネル

- チャンネルページ
- チャンネル編集
- チャンネル登録
- 登録チャンネル一覧
- 登録者数表示
- アバター画像変更

### アカウント

- ログイン
- 新規登録
- Googleログイン（OAuth）
- メールアドレス変更
- パスワード変更
- アカウント削除

### その他

- 動画共有
- 埋め込みコード生成
- トピック表示
- ダークテーマ・コーラルテーマ切替
- リクエスト送信
- 管理画面
- 管理者によるリクエスト管理
- トピック管理
- ユーザー管理

---

## 認証

- Laravel Sanctumによるセッション認証
- Google OAuth（Laravel Socialite）
- CSRF保護
- ログイン状態管理

---

## ER図

以下のER図でデータ構造を整理しています。

- er.svg

---

## セットアップ手順

### Backend

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate --seed

php artisan storage:link

php artisan serve
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## デプロイ

- Frontend：Vercel
- Backend：Railway

---

## 工夫した点

- Laravel APIとNext.jsを分離した構成を採用
- Google OAuth（SSO）による認証を実装
- テーマ切替をCSS Variablesで実装し、全画面へ反映
- 動画・コメント・ユーザー間のリレーションを意識したAPI設計
- モーダルや共有機能など、実際の動画サービスに近いUIを実装
- 管理画面を用意し、トピック・リクエスト・ユーザー管理を可能にした

---

## 今後の改善案

- Google以外のSSO（GitHub、Microsoft等）への対応
- メール認証・パスワードリセット機能
- テストコードの追加
- パフォーマンス最適化