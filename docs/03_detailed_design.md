# 詳細設計書 (Detailed Design)

> [!NOTE]
> 本ドキュメントは、アプリケーション実装に用いられる具体的なクラス構成、コンポーネント設計、データハンドリングについて定義します。

## 1. フロントエンド詳細設計 (React Components)

### 1.1 ディレクトリ構成と責務
- `src/components/`
  - `PostForm.tsx`: 投稿フォームのUIと送信ロジック（バリデーション処理を含む）。ログイン時のみレンダリングされる。
  - `AuthForm.tsx`: ログインフォームおよび新規登録フォーム。状態により表示を切り替え、Auth処理をバックエンドへリクエストする。
- `src/context/`
  - `AuthContext`: ログイン状態（`User`オブジェクト）をアプリケーション全体に提供する。

### 1.2 状態管理と通信フロー
- **グローバル状態**: React Contextを利用して、認証状態を管理し、ヘッダーの表示切り替えや投稿フォームの活性化に利用する。
- **データフェッチ**: `useEffect` フックとAxiosを利用して API通信を行う。環境変数 `VITE_API_URL` により、リクエスト先を動的に決定する。

## 2. バックエンド詳細設計 (Spring Boot Layers)

バックエンドは、明確な責務分離のため レイヤードアーキテクチャ(Controller -> Service -> Repository)を採用しています。

### 2.1 セキュリティ層 (`SecurityConfig.java`)
- **認可制御 (Authorization)**:
  - 公開API（`GET /api/posts`, `/api/auth/**`）に対するアクセス許可。
  - その他のAPIに対する認証（Authentication）の必須化。
- **CORS設定**:
  - `CorsConfigurationSource` Beanを定義し、クレデンシャル通信（Cookie等）を許可（`setAllowCredentials(true)`）。

### 2.2 コントローラー層 (Controller)
ユーザーHTTPリクエストの受付と、ルーティングを行います。

- `AuthController`
  - `POST /login`: `AuthService.authenticateUser()` へ委譲。
  - `POST /register`: RequestParam内の `@Valid` バリデーション実行後、登録処理へ。
- `PostController`
  - `GET /posts`: 全ての投稿を取得（リスト内は `PostDto` にマッピングされる）。
  - `POST /posts`: `SecurityContextHolder`のAuthentication情報を引数として渡し、セキュアな投稿作成を実施。

### 2.3 サービス層 (Service)
ビジネスロジックの実行を担当します。

- `AuthService`
  - 新規登録時、`PasswordEncoder` を用いてパスワードをハッシュ化。
  - `AuthenticationManager` による認証が成功した場合、`SecurityContext` に認証情報を登録。
- `PostService`
  - `PostRepository` 経由でのデータ永続化。
  - **DTO変換**: Entityである `Post` オブジェクトをそのまま返却せず、循環参照を回避し不要なパスワード情報を隠蔽するため、`PostDto` に変換してController層へ返却する。

### 2.4 エンティティとデータ構造 (Entity & DTO)

#### 【Entity】データベースとのマッピング
- `User`: `id` / `username` (NotBlank, 3~20 chars) / `password` (NotBlank, 6~100 chars)。※入力時(DTO)は40文字制限ですが、BCryptでハッシュ化された文字列を格納するためEntityは100文字分確保しています。
- `Post`: `id` / `title` (NotBlank) / `content` (NotBlank, max 1000) / `author` (ManyToOne)。

#### 【DTO】API リクエスト/レスポンス
- `LoginRequest` / `RegisterRequest`: クライアントからの入力値受取用（Register時のパスワードは6〜40文字制約、および半角英数字・記号のみを正規表現で許容）。
- `PostCreateRequest`: 投稿作成時の受取用（タイトル、本文のみ）。
- `PostDto`: 投稿データのレスポンス用。作成者の情報（IDやユーザーネーム）を含むが、パスワードなどの機密情報はカットされる。
- `MessageResponse`: 汎用的なシステムメッセージ送信用オブジェクト。
