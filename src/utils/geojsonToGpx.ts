// GeoJSON(LineString/MultiLineString) → GPX文字列変換ユーティリティ
import { GeoJSONFeature } from '@/store/geojsonStore';

export function geojsonToGpx(feature: GeoJSONFeature): string {
  let segments: number[][][] = [];
  if (feature.geometry.type === 'LineString') {
    segments = [feature.geometry.coordinates];
  } else if (feature.geometry.type === 'MultiLineString') {
    segments = feature.geometry.coordinates;
  } else {
    throw new Error('Only LineString or MultiLineString supported for GPX export');
  }

  const trksegs = segments.map(seg =>
    `<trkseg>\n` +
    seg.map(coord => {
      const [lon, lat, ele] = coord;
      return `<trkpt lat=\"${lat}\" lon=\"${lon}\">${typeof ele === 'number' ? `\n  <ele>${ele}</ele>` : ''}\n</trkpt>`;
    }).join('\n') +
    `\n</trkseg>`
  ).join('\n');

  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n` +
    `<gpx version=\"1.1\" creator=\"gpx-merge\" xmlns=\"http://www.topografix.com/GPX/1/1\">\n` +
    `<trk>\n${trksegs}\n</trk>\n</gpx>\n`;
}
