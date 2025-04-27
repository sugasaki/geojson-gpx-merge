import React from 'react';
import { useGeojsonStore } from '../store/geojsonStore';

export default function DownloadButton() {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);

  const handleDownload = () => {
    if (!mergedGeojson) return;
    const blob = new Blob([
      JSON.stringify({ type: 'FeatureCollection', features: [mergedGeojson] }, null, 2),
    ], { type: 'application/geo+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.geojson';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
      onClick={handleDownload}
      disabled={!mergedGeojson}
    >
      結合GeoJSONをダウンロード
    </button>
  );
}
