// GPX(XML文字列)→GeoJSON FeatureCollection 変換
// @tmcw/togeojsonを使う想定
import { FeatureCollection } from 'geojson';
import { gpx } from '@tmcw/togeojson';

export async function gpxToGeojson(gpxText: string): Promise<FeatureCollection | null> {
  // @tmcw/togeojsonはXMLDocumentを受け取るので、パースが必要
  try {
    const parser = new DOMParser();
    const xml = parser.parseFromString(gpxText, 'application/xml');
    const geojson = gpx(xml);
    if (geojson && geojson.type === 'FeatureCollection') {
      return geojson;
    }
    return null;
  } catch (e) {
    console.error('[gpxToGeojson] 変換エラー', e);
    return null;
  }
}
