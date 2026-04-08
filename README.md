# ✨ Web App Demo

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://project-ivory-rho-74.vercel.app/)

このプロジェクトは、フロントエンドにReact（Vite）、バックエンドにSpring Bootを利用したフルスタックのWebアプリケーションです。  
　※バックエンドはRenderフリープランのため、起動に1分程度かかる場合があります。  
　　仕様書はアプリ起動後、ロゴの右から📄 Data Flow Docsを参照ください

👉 **[実際のアプリをプレビューする（ここをクリック）](https://project-ivory-rho-74.vercel.app/)**

## 📖 プロジェクトの概要

職業訓練で作成したX(旧twitter)の機能再現アプリをフレームワークを使用して再構築しました。  
AntigravityによるAI駆動開発を行い、2日で自動テスト+手動での最終動作確認まで完了できています。


## 🚀 主な機能

- **ユーザー認証機能**
  - 新規アカウント登録、ログイン、セッション管理処理（Spring Security）
- **投稿機能**
  - ログイン済みのユーザーのみが記事を投稿可能
- **タイムライン機能**
  - すべてのユーザーが投稿一覧を閲覧可能

## 🛠 使用技術（Tech Stack）

### Frontend
- **React (TSX)**
- **TypeScript**
- **Vite** (ビルドツール)
- **CSS** (Vanilla CSS)
- Hosting: **Vercel**

### Backend
- **Java 17**
- **Spring Boot 3.x**
  - Spring Web, Spring Security, Spring Data JPA
- **Gradle** (ビルドツール)
- Hosting: **Render.com** (Docker環境)

### Database
- **H2 Database** (※インメモリデータベースのため、一定時間でデータリセット)

## 🤔 工夫した点・課題と解決策

- **CORS設定とクラウド連携**:
  フロントエンド(Vercel)とバックエンド(Render)を分離してデプロイしたため、別ドメイン間の通信によるCORSエラーが発生しました。Spring Securityの `CorsConfigurationSource` を設定し、セッションを含むクレデンシャル通信（Cookie同期）を許可することで連携を実現しました。
- **環境変数の切り分け**:
  ローカル開発環境と本番環境でAPIの通信先が異なるため、Vite側で `.env` を活用して `VITE_API_URL` を動的に出力する設計にしました。


## 今後の展望

- **フレームワークの完全理解**:
  処理フローを追って一通りの動作は理解出来たが、細部の仕様や構文についての理解が不完全
  機能追加や改修を通して更に理解を深めていきたい

- **Databaseのデータ永続化とユーザーごとの権限を追加し、個人用のナレッジ記録アプリへ改修**:
  基本構造を変えないまま転用可能と推測
  なるべく料金がかからない方法で完成させたい  


## 💻 ローカルでの動かし方（開発者向け）

自分のPCでこのアプリを動かすための手順です。

### 1. バックエンドの起動
```bash
# プロジェクトルートディレクトリで以下を実行
./gradlew.bat bootRun
```
(通常 http://localhost:8080 で起動します)

### 2. フロントエンドの起動
```bash
# frontendディレクトリに移動して以下を実行
cd frontend
npm install
npm run dev
```
(通常 http://localhost:5173 で起動します)
