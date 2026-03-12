import { GeoJSON } from '@/store/geojsonStore';
import { geojsonToGpx } from '@/utils/geojsonToGpx';

export function downloadGeoData(fc: GeoJSON, ext: 'geojson' | 'gpx') {
  let blob: Blob, filename: string;
  if (ext === 'geojson') {
    blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' });
    filename = 'merged.geojson';
  } else {
    const { gpx, skippedTypes } = geojsonToGpx(fc);
    if (skippedTypes.length > 0) {
      alert(`GPXエクスポートで未対応のgeometry typeがスキップされました: ${skippedTypes.join(', ')}`);
    }
    blob = new Blob([gpx], { type: 'application/gpx+xml' });
    filename = 'merged.gpx';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
