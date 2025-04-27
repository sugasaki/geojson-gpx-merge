import React from 'react';
import { useGeojsonStore } from '../store/geojsonStore';
import { geojsonToGpx } from '../utils/geojsonToGpx';

export default function DownloadButton() {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);

  const handleDownload = (ext: 'geojson' | 'gpx') => {
    if (!mergedGeojson) return;
    let blob: Blob, filename: string;
    if (ext === 'geojson') {
      blob = new Blob([
        JSON.stringify({
          type: 'FeatureCollection',
          features: [mergedGeojson],
        }, null, 2)
      ], { type: 'application/geo+json' });
      filename = 'merged.geojson';
    } else {
      const gpx = geojsonToGpx(mergedGeojson);
      blob = new Blob([gpx], { type: 'application/gpx+xml' });
      filename = 'merged.gpx';
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="flex gap-2">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded shadow disabled:opacity-50"
        onClick={() => handleDownload('geojson')}
        disabled={!mergedGeojson}
      >
        GeoJSONダウンロード
      </button>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded shadow disabled:opacity-50"
        onClick={() => handleDownload('gpx')}
        disabled={!mergedGeojson}
      >
        GPXダウンロード
      </button>
    </div>
  );
}
