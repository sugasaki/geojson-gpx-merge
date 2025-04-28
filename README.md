# geojson-gpx-merge

GeoJSON/GPXファイルを結合し、地図上で可視化＆高度グラフ連携できるReactアプリです。

## 主な機能

- 複数のGeoJSONおよびGPXファイル（LineString/Polygon/トラック等）をアップロード＆結合
- ファイル順をドラッグ＆ドロップで変更可能
- 結合結果をMapTiler地図上に表示（APIキー対応）
- 結合GeoJSONの高度（Z値）をグラフ化
- グラフ上をホバーすると地図上に該当点のマーカー表示
- GeoJSON/GPX両形式でダウンロード可能
- ファイル削除・順序入替・ダウンロード機能

## 使い方

1. このリポジトリをclone
2. 依存インストール
   ```sh
   pnpm install
   # または npm install
   ```
3. MapTilerでAPIキーを取得し、`.env`ファイルに設定
   ```env
   VITE_MAPTILER_KEY=あなたのAPIキー
   ```
   - サンプル: `.env.sample` 参照
4. 開発サーバ起動
   ```sh
   pnpm dev
   # または npm run dev
   ```
5. ブラウザで `http://localhost:5173` などにアクセス

## 技術スタック
- React
- Zustand (状態管理)
- MapLibre GL / @vis.gl/react-maplibre (地図表示)
- MapTiler Streetsスタイル/APIキー
- Tailwind CSS (UI)
- recharts (グラフ)

## ディレクトリ構成例
```
├── src
│   ├── components
│   │   ├── GeojsonUploader.tsx
│   │   ├── MapView.tsx
│   │   ├── Chart.tsx
│   │   └── DownloadButton.tsx
│   ├── utils
│   │   ├── geojsonMerge.ts
│   │   ├── geojsonBounds.ts
│   │   └── geojsonToGpx.ts
│   └── store
│       └── geojsonStore.ts
├── .env.sample
├── .gitignore
├── package.json
├── README.md
└── ...

## 注意
- `.env` にはAPIキー等の秘匿情報を記載し、**絶対にコミットしないでください**
- `.env.sample` を参考にしてください
- `node_modules` など不要なファイルは`.gitignore`で管理

## ライセンス
MIT
