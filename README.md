# GeoJSON File Merging Tool (gpx-merge)

GeoJSONファイルを結合し、地図上で可視化＆高度グラフ連携できるReactアプリです。

## 主な機能

- 複数のGeoJSONファイル（LineString/Polygon等）をアップロード＆結合
- ファイル順をドラッグ＆ドロップで変更可能
- 結合結果をMapLibre地図上に表示
- 結合GeoJSONの高度（Z値）をグラフ化
- グラフ上をホバーすると地図上に該当点のマーカー表示
- ファイル削除・順序入替・ダウンロード機能

## 使い方

1. このリポジトリをclone
2. 依存インストール
   ```sh
   pnpm install
   # または npm install
   ```
3. 開発サーバ起動
   ```sh
   pnpm dev
   # または npm run dev
   ```
4. ブラウザで `http://localhost:5173` などにアクセス

## 技術スタック
- React
- Zustand (状態管理)
- MapLibre GL / @vis.gl/react-maplibre (地図表示)
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
│   │   └── geojsonBounds.ts
│   └── store
│       └── geojsonStore.ts
├── package.json
├── README.md
└── ...
```

## ライセンス
MIT
