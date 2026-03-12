import { describe, it, expect } from 'vitest';
import { mergeGeojsons } from '@/utils/geojsonMerge';
import { GeoJSON } from '@/store/geojsonStore';

const lineFC: GeoJSON = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: { type: 'LineString', coordinates: [[0, 0], [1, 1]] },
    properties: {},
  }],
};

const pointFC: GeoJSON = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [2, 2] },
    properties: { name: 'test' },
  }],
};

describe('mergeGeojsons', () => {
  it('空配列ではnullを返す', () => {
    expect(mergeGeojsons([])).toBeNull();
  });

  it('featuresが空のFCのみではnullを返す', () => {
    expect(mergeGeojsons([{ type: 'FeatureCollection', features: [] }])).toBeNull();
  });

  it('1つのFCをそのまま返す', () => {
    const result = mergeGeojsons([lineFC]);
    expect(result).not.toBeNull();
    expect(result!.features).toHaveLength(1);
    expect(result!.features[0].geometry.type).toBe('LineString');
  });

  it('複数のFCを結合する', () => {
    const result = mergeGeojsons([lineFC, pointFC]);
    expect(result).not.toBeNull();
    expect(result!.features).toHaveLength(2);
  });

  it('異なるgeometry typeが混在しても結合できる', () => {
    const result = mergeGeojsons([lineFC, pointFC]);
    expect(result!.features[0].geometry.type).toBe('LineString');
    expect(result!.features[1].geometry.type).toBe('Point');
  });

  it('propertiesが保持される', () => {
    const result = mergeGeojsons([pointFC]);
    expect(result!.features[0].properties.name).toBe('test');
  });
});
