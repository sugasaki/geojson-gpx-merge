// GPX(XML文字列)→GeoJSON FeatureCollection 変換（表示用）
import { GeoJSON } from '@/store/geojsonStore';
import { gpx } from '@tmcw/togeojson';

export async function gpxToGeojson(gpxText: string): Promise<GeoJSON | null> {
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(gpxText, 'application/xml');
    const geojson = gpx(xml);
    if (geojson && geojson.type === 'FeatureCollection') {
      return geojson as GeoJSON;
    }
    return null;
  } catch (e) {
    console.error('[gpxToGeojson] 変換エラー', e);
    return null;
  }
}
