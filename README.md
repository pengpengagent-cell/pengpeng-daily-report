# PengPeng Daily Report 2.0

Active Goals進捗ダッシュボード - PengPengの自律性向上を可視化するWebアプリケーション

## 概要

PengPeng Daily Report 2.0は、PengPeng AIエージェントのActive Goals（G1-G3）の進捗をリアルタイムで可視化するダッシュボードです。既存のCronジョブ監視ダッシュボードを拡張し、以下の機能を追加しました：

### 主な機能

1. **Active Goals進捗可視化**
   - G1: Learning Session品質向上
   - G2: 完全自律バックアップ・復旧
   - G3: コスト最適化

2. **詳細分析セクション**
   - Learning Session分析（品質スコア、Ownerフィードバック）
   - バックアップ健全性（Gitコミット履歴、連続日数）
   - システム健全性（Cronジョブ実行状況）
   - コスト分析（モデル使用比率、コスト推移）

3. **リアルタイム監視**
   - 5分ごとの自動更新
   - システム健全性スコア
   - 異常検知アラート

## 技術スタック

- **フロントエンド**: Next.js 15 (App Router)
- **UIライブラリ**: shadcn/ui + Tailwind CSS v4
- **チャート**: カスタムコンポーネント（将来的にRecharts統合予定）
- **バックエンド**: Next.js API Routes
- **デプロイ**: Vercel
- **CI/CD**: GitHub Actions（予定）

## セットアップ

### ローカル開発

1. リポジトリをクローン:
```bash
git clone https://github.com/pengpengagent-cell/pengpeng-dashboard.git
cd pengpeng-dashboard
```

2. 依存関係をインストール:
```bash
npm install
```

3. 環境変数を設定:
```bash
cp .env.local.example .env.local
```

4. `.env.local`を編集:
```env
# GitHub API設定
GITHUB_TOKEN=your_github_personal_access_token_here

# Slack API設定
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token-here

# アプリケーション設定
NEXT_PUBLIC_APP_NAME=PengPeng Daily Report 2.0
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_REFRESH_INTERVAL=300000
NEXT_PUBLIC_ENABLE_ALERTS=true
```

5. 開発サーバーを起動:
```bash
npm run dev
```

6. ブラウザで http://localhost:3000 を開く

### Vercelデプロイ

1. Vercelにプロジェクトをインポート:
   - GitHubリポジトリを接続
   - フレームワークプリセット: Next.js
   - ルートディレクトリ: `/`

2. 環境変数を設定（Vercel Dashboard）:
   - `GITHUB_TOKEN`: GitHub Personal Access Token
   - `SLACK_BOT_TOKEN`: Slack Bot Token
   - `NEXT_PUBLIC_APP_NAME`: PengPeng Daily Report 2.0
   - `NEXT_PUBLIC_APP_VERSION`: 2.0.0
   - `NEXT_PUBLIC_API_BASE_URL`: https://your-domain.vercel.app/api
   - `NEXT_PUBLIC_REFRESH_INTERVAL`: 300000
   - `NEXT_PUBLIC_ENABLE_ALERTS`: true

3. デプロイ:
   - Vercelが自動的にデプロイを実行
   - デプロイ完了後、公開URLが発行される

## APIエンドポイント

### 1. GitHubコミットデータ
```
GET /api/github/commits
```
- ワークスペースバックアップリポジトリのコミット履歴を取得
- 統計情報（連続コミット日数、平均コミット数等）を返す

### 2. Learning Sessionデータ
```
GET /api/slack/learning-sessions
```
- Slack #learningチャンネルのLearning Session投稿を分析
- 品質スコア、Ownerフィードバック率を計算

### 3. システム健全性データ
```
GET /api/system/health
```
- Cronジョブ実行状況を監視
- コスト分析、モデル使用比率を提供
- Active Goals進捗データを生成

## アーキテクチャ

### データフロー
```
[データソース] → [API Routes] → [フロントエンド] → [UI表示]
   │                    │              │              │
   ├─ GitHub API        ├─ データ整形  ├─ React状態管理├─ リアルタイム更新
   ├─ Slack API         ├─ 統計計算    ├─ 自動更新     └─ インタラクティブUI
   └─ OpenClawログ      └─ キャッシュ  └─ エラー処理
```

### コンポーネント構造
```
app/
├── page.tsx              # メインダッシュボード
├── api/                  # API Routes
│   ├── github/commits/
│   ├── slack/learning-sessions/
│   └── system/health/
├── components/           # UIコンポーネント
│   ├── goal-progress-card.tsx
│   └── ui/              # shadcn/uiコンポーネント
├── lib/                  # ユーティリティ
│   ├── api.ts           # API呼び出し
│   └── utils.ts         # 共通関数
└── types/               # TypeScript型定義
    └── dashboard.ts
```

## 今後の拡張計画

### Phase 3: 自動化・定期更新
- [ ] GitHub Actionsによる定期データ収集
- [ ] Vercel Cron Jobs設定
- [ ] 自動更新機能の強化

### Phase 4: 通知・アラート機能
- [ ] 異常検知アラート
- [ ] Slack通知統合
- [ ] メールレポート

### Phase 5: 高度な可視化
- [ ] Recharts統合
- [ ] 時系列グラフの強化
- [ ] 予測分析機能

## 開発原則

1. **Function First, Polish Second**
   - 動くものを優先、見た目は後で改善

2. **小さなイテレーション**
   - 1コミット200行以下を目指す

3. **失敗を早く**
   - 即テスト、即修正の文化

4. **ユーザー視点**
   - Ownerが毎朝チェックする価値を提供

5. **シンプルに保つ**
   - YAGNI原則（必要になるまで実装しない）

## ライセンス

MIT License

## 貢献

1. Issueを作成
2. 機能提案やバグ報告
3. Pull Requestを作成

## 連絡先

- GitHub: [pengpengagent-cell](https://github.com/pengpengagent-cell)
- X: [@PengPeng_agent](https://x.com/PengPeng_agent)
- ダッシュボード: https://pengpeng-dashboard.vercel.app