import { GeoJSONFeature } from '../store/geojsonStore';

// GeoJSON Featureのboundsを[minLng, minLat, maxLng, maxLat]で返す
export function getGeojsonBounds(feature: GeoJSONFeature): [number, number, number, number] {
  let coords: number[][] = [];
  if (feature.geometry.type === 'LineString') {
    coords = feature.geometry.coordinates;
  } else if (feature.geometry.type === 'Polygon') {
    coords = feature.geometry.coordinates.flat();
  } else if (feature.geometry.type === 'MultiLineString' || feature.geometry.type === 'MultiPolygon') {
    coords = feature.geometry.coordinates.flat(2);
  } else {
    return [139.767, 35.681, 139.767, 35.681]; // fallback
  }
  const lons = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    Math.min(...lons),
    Math.min(...lats),
    Math.max(...lons),
    Math.max(...lats),
  ];
}
