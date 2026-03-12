import { describe, it, expect } from 'vitest';
import { mergeGpxTexts } from '@/utils/gpxMerge';

const gpx1 = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TestApp"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3">
  <metadata><name>File1</name></metadata>
  <trk>
    <trkseg>
      <trkpt lat="35.0" lon="139.0"><ele>100</ele></trkpt>
      <trkpt lat="35.1" lon="139.1"><ele>200</ele></trkpt>
    </trkseg>
  </trk>
  <wpt lat="35.5" lon="139.5">
    <name>WP1</name>
    <extensions>
      <gpxx:WaypointExtension>
        <gpxx:DisplayMode>SymbolAndName</gpxx:DisplayMode>
      </gpxx:WaypointExtension>
    </extensions>
  </wpt>
</gpx>`;

const gpx2 = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="TestApp2"
     xmlns="http://www.topografix.com/GPX/1/1">
  <metadata><name>File2</name></metadata>
  <trk>
    <trkseg>
      <trkpt lat="36.0" lon="140.0"><ele>300</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;

describe('mergeGpxTexts', () => {
  it('空配列では空文字を返す', () => {
    expect(mergeGpxTexts([])).toBe('');
  });

  it('1つのGPXはそのまま返す', () => {
    expect(mergeGpxTexts([gpx1])).toBe(gpx1);
  });

  it('複数GPXをマージできる', () => {
    const result = mergeGpxTexts([gpx1, gpx2]);
    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(result).toContain('<gpx');
    expect(result).toContain('</gpx>');
  });

  it('最初のGPXのcreatorを使用する', () => {
    const result = mergeGpxTexts([gpx1, gpx2]);
    expect(result).toContain('creator="TestApp"');
    expect(result).not.toContain('creator="TestApp2"');
  });

  it('最初のGPXのmetadataのみ保持する', () => {
    const result = mergeGpxTexts([gpx1, gpx2]);
    expect(result).toContain('File1');
    expect(result).not.toContain('File2');
  });

  it('全ファイルのwptを保持する', () => {
    const result = mergeGpxTexts([gpx1, gpx2]);
    expect(result).toContain('<wpt');
    expect(result).toContain('WP1');
  });

  it('extensionsが冗長なnamespace宣言なしで保持される', () => {
    const result = mergeGpxTexts([gpx1, gpx2]);
    expect(result).toContain('gpxx:WaypointExtension');
    expect(result).toContain('gpxx:DisplayMode');
    // ルート要素にxmlns:gpxxが宣言されているので子要素には不要
    expect(result).toContain('xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3"');
    // 子要素内に冗長なxmlns:gpxx宣言がないことを確認
    const rootDecl = result.indexOf('xmlns:gpxx=');
    const secondDecl = result.indexOf('xmlns:gpxx=', rootDecl + 1);
    expect(secondDecl).toBe(-1);
  });

  it('最初のtrkのメタデータ（name等）が保持される', () => {
    const gpxWithTrkMeta = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test"
     xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>Track1</name>
    <type>hiking</type>
    <trkseg>
      <trkpt lat="35.0" lon="139.0"><ele>100</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;
    const gpxWithTrkMeta2 = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test2"
     xmlns="http://www.topografix.com/GPX/1/1">
  <trk>
    <name>Track2</name>
    <trkseg>
      <trkpt lat="36.0" lon="140.0"><ele>200</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;
    const result = mergeGpxTexts([gpxWithTrkMeta, gpxWithTrkMeta2]);
    // 最初のtrkのメタデータが保持される
    expect(result).toContain('Track1');
    expect(result).toContain('hiking');
    // 2番目のtrkのメタデータは含まれない
    expect(result).not.toContain('Track2');
  });

  it('ルート要素のその他属性（xsi:schemaLocation等）が保持される', () => {
    const gpxWithSchema = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <trk>
    <trkseg>
      <trkpt lat="35.0" lon="139.0"><ele>100</ele></trkpt>
    </trkseg>
  </trk>
</gpx>`;
    const result = mergeGpxTexts([gpxWithSchema, gpx2]);
    expect(result).toContain('xsi:schemaLocation=');
    expect(result).toContain('xmlns:xsi=');
  });

  it('全ファイルのtrksegが1つのtrkにまとめられる', () => {
    const result = mergeGpxTexts([gpx1, gpx2]);
    const trkMatches = result.match(/<trk>/g);
    expect(trkMatches).toHaveLength(1);
    const trksegMatches = result.match(/<trkseg>/g);
    expect(trksegMatches).toHaveLength(2);
  });
});
