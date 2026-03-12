import { describe, it, expect } from 'vitest';
import { getGeojsonBounds } from '@/utils/geojsonBounds';
import { GeoJSON } from '@/store/geojsonStore';

describe('getGeojsonBounds', () => {
  it('featuresが空ではnullを返す', () => {
    expect(getGeojsonBounds({ type: 'FeatureCollection', features: [] })).toBeNull();
  });

  it('LineStringのboundsを正しく計算する', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [[139, 35], [140, 36]] },
        properties: {},
      }],
    };
    expect(getGeojsonBounds(fc)).toEqual([139, 35, 140, 36]);
  });

  it('Pointのboundsを正しく計算する', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [139.5, 35.5] },
        properties: {},
      }],
    };
    expect(getGeojsonBounds(fc)).toEqual([139.5, 35.5, 139.5, 35.5]);
  });

  it('混在するgeometry typeでもboundsを計算する', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [[139, 35], [140, 36]] }, properties: {} },
        { type: 'Feature', geometry: { type: 'Point', coordinates: [138, 34] }, properties: {} },
      ],
    };
    expect(getGeojsonBounds(fc)).toEqual([138, 34, 140, 36]);
  });

  it('Polygonのboundsを正しく計算する', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]]] },
        properties: {},
      }],
    };
    expect(getGeojsonBounds(fc)).toEqual([0, 0, 10, 10]);
  });
});
