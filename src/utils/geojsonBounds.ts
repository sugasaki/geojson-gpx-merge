import { GeoJSON, GeoJSONFeature } from '@/store/geojsonStore';

function extractCoords(feature: GeoJSONFeature): number[][] {
  const { type, coordinates } = feature.geometry;
  if (type === 'Point') return [coordinates];
  if (type === 'MultiPoint' || type === 'LineString') return coordinates;
  if (type === 'Polygon' || type === 'MultiLineString') return coordinates.flat();
  if (type === 'MultiPolygon') return coordinates.flat(2);
  return [];
}

// GeoJSON FeatureCollectionのboundsを[minLng, minLat, maxLng, maxLat]で返す
export function getGeojsonBounds(fc: GeoJSON): [number, number, number, number] | null {
  const coords = fc.features.flatMap(extractCoords);
  if (coords.length === 0) return null;
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    Math.min(...lons),
    Math.min(...lats),
    Math.max(...lons),
    Math.max(...lats),
  ];
}
