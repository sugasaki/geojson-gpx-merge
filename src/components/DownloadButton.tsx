import React from 'react';
import { useGeojsonStore } from '../store/geojsonStore';
import { downloadGeoData } from '../utils/download';

export default function DownloadButton() {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);

  const handleDownload = (ext: 'geojson' | 'gpx') => {
    if (!mergedGeojson) return;
    downloadGeoData(mergedGeojson, ext);
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
