import { GeoJSON, GeoJSONFeature } from '../store/geojsonStore';

/**
 * 複数のGeoJSON FeatureCollectionを1つのFeatureに結合
 * @param geojsons FeatureCollectionの配列
 * @returns 1つのFeature、またはnull
 */
export function mergeGeojsons(geojsons: GeoJSON[]): GeoJSONFeature | null {
  if (geojsons.length === 0) return null;
  const geometryType = geojsons[0].features[0]?.geometry.type;
  if (!geometryType) return null;
  let mergedCoordinates: any[] = [];
  for (const geojson of geojsons) {
    for (const feature of geojson.features) {
      if (feature.geometry.type !== geometryType) return null;
      if (geometryType === 'LineString') {
        mergedCoordinates = mergedCoordinates.concat(feature.geometry.coordinates);
      } else if (geometryType === 'Polygon') {
        mergedCoordinates = mergedCoordinates.concat(feature.geometry.coordinates);
      } else if (geometryType === 'MultiLineString') {
        mergedCoordinates = mergedCoordinates.concat(feature.geometry.coordinates);
      } else if (geometryType === 'MultiPolygon') {
        mergedCoordinates = mergedCoordinates.concat(feature.geometry.coordinates);
      } else {
        return null;
      }
    }
  }
  return {
    type: 'Feature',
    geometry: {
      type: geometryType,
      coordinates: mergedCoordinates,
    },
    properties: {},
  };
}
