import { GeoJSON } from '@/store/geojsonStore';
import { mergeGpxTexts } from '@/utils/gpxMerge';
import { geojsonToGpx } from '@/utils/geojsonToGpx';

export function downloadGeoData(fc: GeoJSON, ext: 'geojson' | 'gpx', rawGpxTexts: string[]) {
  let blob: Blob, filename: string;
  if (ext === 'geojson') {
    blob = new Blob([JSON.stringify(fc, null, 2)], { type: 'application/geo+json' });
    filename = 'merged.geojson';
  } else {
    let gpxText: string;
    if (rawGpxTexts.length > 0) {
      // 元のGPX XMLをそのままマージ（情報欠落なし）
      gpxText = mergeGpxTexts(rawGpxTexts);
    } else {
      // GeoJSONのみの場合はGeoJSON→GPX変換
      const { gpx, skippedTypes } = geojsonToGpx(fc);
      if (skippedTypes.length > 0) {
        alert(`GPXエクスポートで未対応のgeometry typeがスキップされました: ${skippedTypes.join(', ')}`);
      }
      gpxText = gpx;
    }
    blob = new Blob([gpxText], { type: 'application/gpx+xml' });
    filename = 'merged.gpx';
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
