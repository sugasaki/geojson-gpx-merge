import { GeoJSONFeature } from '../store/geojsonStore';
import { geojsonToGpx } from './geojsonToGpx';

export function downloadGeoData(feature: GeoJSONFeature, ext: 'geojson' | 'gpx') {
  let blob: Blob, filename: string;
  if (ext === 'geojson') {
    blob = new Blob([
      JSON.stringify({
        type: 'FeatureCollection',
        features: [feature],
      }, null, 2)
    ], { type: 'application/geo+json' });
    filename = 'merged.geojson';
  } else {
    const gpx = geojsonToGpx(feature);
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
