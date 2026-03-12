import { GeoJSON } from '@/store/geojsonStore';

/**
 * 複数のGeoJSON FeatureCollectionを1つのFeatureCollectionに結合
 * geometry typeが混在していてもそのまま保持する
 */
export function mergeGeojsons(geojsons: GeoJSON[]): GeoJSON | null {
  if (geojsons.length === 0) return null;
  const features = geojsons.flatMap((g) => g.features);
  if (features.length === 0) return null;
  return {
    type: 'FeatureCollection',
    features,
  };
}
