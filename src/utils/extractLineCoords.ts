import { GeoJSONFeature } from '@/store/geojsonStore';

/**
 * FeatureCollectionのfeaturesからLineString/MultiLineStringの座標を抽出して結合する
 */
export function extractLineCoords(features: GeoJSONFeature[]): number[][] {
  const coords: number[][] = [];
  for (const f of features) {
    if (f.geometry.type === 'LineString') {
      coords.push(...f.geometry.coordinates);
    } else if (f.geometry.type === 'MultiLineString') {
      coords.push(...f.geometry.coordinates.flat());
    }
  }
  return coords;
}
