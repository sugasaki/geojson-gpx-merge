import { gpxToGeojson } from '@/utils/gpxToGeojson';
import { FeatureCollection } from 'geojson';

export async function fileToGeojson(file: File): Promise<FeatureCollection | null> {
  const text = await file.text();
  let json = null;
  if (file.name.toLowerCase().endsWith('.gpx') || file.type === 'application/gpx+xml') {
    json = await gpxToGeojson(text);
  } else {
    try {
      json = JSON.parse(text);
    } catch {}
  }
  if (json && json.type === 'FeatureCollection') {
    return json;
  }
  return null;
}
