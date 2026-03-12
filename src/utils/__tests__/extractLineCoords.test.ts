import { describe, it, expect } from 'vitest';
import { extractLineCoords } from '@/utils/extractLineCoords';
import { GeoJSONFeature } from '@/store/geojsonStore';

describe('extractLineCoords', () => {
  it('空配列では空を返す', () => {
    expect(extractLineCoords([])).toEqual([]);
  });

  it('LineStringの座標を抽出する', () => {
    const features: GeoJSONFeature[] = [{
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
      properties: {},
    }];
    expect(extractLineCoords(features)).toEqual([[0, 0], [1, 1]]);
  });

  it('MultiLineStringの座標をフラットに抽出する', () => {
    const features: GeoJSONFeature[] = [{
      type: 'Feature',
      geometry: { type: 'MultiLineString', coordinates: [[[0, 0], [1, 1]], [[2, 2], [3, 3]]] },
      properties: {},
    }];
    expect(extractLineCoords(features)).toEqual([[0, 0], [1, 1], [2, 2], [3, 3]]);
  });

  it('Point等のLineString系以外は無視する', () => {
    const features: GeoJSONFeature[] = [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] }, properties: {} },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[1, 1], [2, 2]] }, properties: {} },
    ];
    expect(extractLineCoords(features)).toEqual([[1, 1], [2, 2]]);
  });

  it('複数のLineStringを結合する', () => {
    const features: GeoJSONFeature[] = [
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] }, properties: {} },
      { type: 'Feature', geometry: { type: 'LineString', coordinates: [[2, 2], [3, 3]] }, properties: {} },
    ];
    expect(extractLineCoords(features)).toEqual([[0, 0], [1, 1], [2, 2], [3, 3]]);
  });
});
