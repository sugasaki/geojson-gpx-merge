import { describe, it, expect } from 'vitest';
import { geojsonToGpx } from '@/utils/geojsonToGpx';
import { GeoJSON } from '@/store/geojsonStore';

describe('geojsonToGpx', () => {
  it('LineStringをtrkとして出力する', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: [[139.0, 35.0, 100], [140.0, 36.0, 200]] },
        properties: {},
      }],
    };
    const { gpx, skippedTypes } = geojsonToGpx(fc);
    expect(skippedTypes).toEqual([]);
    expect(gpx).toContain('<trk>');
    expect(gpx).toContain('<trkseg>');
    expect(gpx).toContain('lat="35"');
    expect(gpx).toContain('lon="139"');
    expect(gpx).toContain('<ele>100</ele>');
  });

  it('Pointをwptとして出力する', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [139.5, 35.5, 50] },
        properties: { name: 'テスト地点', type: 'Food' },
      }],
    };
    const { gpx } = geojsonToGpx(fc);
    expect(gpx).toContain('<wpt');
    expect(gpx).toContain('<name>テスト地点</name>');
    expect(gpx).toContain('<type>Food</type>');
    expect(gpx).toContain('<ele>50</ele>');
  });

  it('XMLの特殊文字をエスケープする', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: { name: 'A & B <C>' },
      }],
    };
    const { gpx } = geojsonToGpx(fc);
    expect(gpx).toContain('A &amp; B &lt;C&gt;');
  });

  it('未対応のgeometry typeをskippedTypesで報告する', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] },
        properties: {},
      }],
    };
    const { skippedTypes } = geojsonToGpx(fc);
    expect(skippedTypes).toContain('Polygon');
  });

  it('nameが文字列でない場合は出力しない', () => {
    const fc: GeoJSON = {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0] },
        properties: { name: 123 },
      }],
    };
    const { gpx } = geojsonToGpx(fc);
    expect(gpx).not.toContain('<name>');
  });
});
