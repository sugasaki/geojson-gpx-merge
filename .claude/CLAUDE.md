# GeoJSON/GPX Merge App - Claude Code ガイド

## プロジェクト概要
複数のGeoJSON・GPXファイルを読み込み、マージして地図上に表示し、標高グラフの可視化やダウンロードを行うWebアプリ。

## 主な機能
- 複数のGeoJSON/GPXファイルのアップロード・マージ
- ドラッグ&ドロップによるファイル順序の変更
- MapTiler地図上でのマージ結果表示
- 標高グラフの可視化（グラフホバーで地図上にマーカー表示）
- マージデータのGeoJSON/GPXダウンロード

## Tech Stack
- React 18 + TypeScript + Vite 4
- Zustand 4 (状態管理)
- maplibre-gl 3.x + @vis.gl/react-maplibre 8.x
- MapTiler Streets スタイル (APIキー必要)
- Tailwind CSS 3 (UI)
- recharts (標高グラフ)
- @hello-pangea/dnd (ドラッグ&ドロップ)
- @tmcw/togeojson (GPX→GeoJSON変換)
- パスエイリアス: `@` → `src/`

## ファイル構成
- `src/App.tsx` - アプリルート
- `src/main.tsx` - エントリーポイント
- `src/store/geojsonStore.ts` - Zustand store (マージ済みGeoJSON管理)
- `src/components/MapView.tsx` - 地図表示
- `src/components/GeojsonUploader.tsx` - ファイルアップロードUI
- `src/components/Chart.tsx` - 標高グラフ
- `src/components/AltitudeChartPanel.tsx` - 標高チャートパネル
- `src/components/ResizableMapAndChart.tsx` - 地図とチャートのリサイズ可能レイアウト
- `src/components/DownloadButton.tsx` - ダウンロードボタン
- `src/components/GithubLink.tsx` - GitHub リンク
- `src/utils/fileToGeojson.ts` - ファイル→GeoJSON変換
- `src/utils/gpxToGeojson.ts` - GPX→GeoJSON変換
- `src/utils/geojsonToGpx.ts` - GeoJSON→GPXエクスポート
- `src/utils/geojsonMerge.ts` - GeoJSONマージ処理
- `src/utils/geojsonBounds.ts` - バウンディングボックス計算
- `src/utils/download.ts` - ダウンロードユーティリティ

## 環境変数
- `VITE_MAPTILER_KEY` - MapTiler APIキー (`.env.local` に設定)
- `.env.sample` を参考にする

## 開発規約

### ブランチ運用
- **mainブランチへの直接プッシュは禁止**。必ずブランチを作成し、PRを経由してマージすること
- Issue あり: `feature/{issue番号}-{概要}` (例: `feature/3-altitude-chart`)
- Issue なし: `chore/{概要}` (例: `chore/update-claude-md`)
- **作業時は Git worktree を使用する**
  - ブランチ切り替えによる衝突を防ぐため、新しい作業を開始するたびに新しい worktree を作成し、その中でのみ作業する
  - Claude Code を使う場合: `EnterWorktree` を実行して worktree を作成する
  - **`.env.local` は Git 管理外のため worktree に自動コピーされない**。必要に応じてメインリポジトリから手動コピー:
    ```sh
    cp /path/to/main-repo/.env.local /path/to/worktree/.env.local
    ```

### コミットメッセージ
- 日本語で記述
- 1行目: 変更の要約
- 空行後に詳細 (必要に応じて)
- Issue がある場合は `Closes #{issue番号}` で自動クローズ

### PR
- タイトル: 日本語OK、70文字以内
- `gh pr create` で作成
- **Issue がある場合**: body に `Closes #{issue番号}` を **必ず** 含める
- **Issue がない場合**: body の Summary で変更理由を明記する
- **PRのマージはユーザーの明示的な承認なしに実行しない**

### レビュー対応
- レビュー指摘への修正をpushした後は、**必ず以下の2つを行う**:
  1. PRコメント欄に対応内容のサマリーを投稿する
  2. 対応済みのレビュースレッドをResolveする（GraphQL API `resolveReviewThread` を使用）

### ビルド確認
- 実装後は必ず `npm run build` でエラーがないことを確認する

### CLIツールの注意点
- `gh pr checks` はチェック失敗時に終了コード1を返す
- **常に `|| true` を付けるのは避ける**
- 終了コード1（チェック失敗）だけ無視したい場合:
  ```sh
  gh pr checks <PR番号> || [ $? -eq 1 ]
  ```
