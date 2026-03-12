import { GeoJSON, GeoJSONFeature } from '@/store/geojsonStore';

function featureToTrksegs(feature: GeoJSONFeature): string[] {
  let segments: number[][][] = [];
  if (feature.geometry.type === 'LineString') {
    segments = [feature.geometry.coordinates];
  } else if (feature.geometry.type === 'MultiLineString') {
    segments = feature.geometry.coordinates;
  } else {
    return [];
  }
  return segments.map(seg =>
    `<trkseg>\n` +
    seg.map(coord => {
      const [lon, lat, ele] = coord;
      return `<trkpt lat="${lat}" lon="${lon}">${typeof ele === 'number' ? `\n  <ele>${ele}</ele>` : ''}\n</trkpt>`;
    }).join('\n') +
    `\n</trkseg>`
  );
}

function featureToWpts(feature: GeoJSONFeature): string[] {
  if (feature.geometry.type !== 'Point') return [];
  const [lon, lat, ele] = feature.geometry.coordinates;
  const name = feature.properties?.name;
  const type = feature.properties?.type;
  let wpt = `<wpt lat="${lat}" lon="${lon}">`;
  if (typeof ele === 'number') wpt += `\n  <ele>${ele}</ele>`;
  if (typeof name === 'string' && name) wpt += `\n  <name>${escapeXml(name)}</name>`;
  if (typeof type === 'string' && type) wpt += `\n  <type>${escapeXml(type)}</type>`;
  wpt += `\n</wpt>`;
  return [wpt];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const SUPPORTED_GPX_TYPES = new Set(['LineString', 'MultiLineString', 'Point']);

export type GpxExportResult = {
  gpx: string;
  skippedTypes: string[];
};

export function geojsonToGpx(fc: GeoJSON): GpxExportResult {
  const trksegs: string[] = [];
  const wpts: string[] = [];
  const skippedTypes = new Set<string>();

  for (const feature of fc.features) {
    if (!SUPPORTED_GPX_TYPES.has(feature.geometry.type)) {
      skippedTypes.add(feature.geometry.type);
    }
    trksegs.push(...featureToTrksegs(feature));
    wpts.push(...featureToWpts(feature));
  }

  let body = '';
  if (trksegs.length > 0) {
    body += `<trk>\n${trksegs.join('\n')}\n</trk>\n`;
  }
  body += wpts.join('\n');
  if (wpts.length > 0) body += '\n';

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<gpx version="1.1" creator="gpx-merge" xmlns="http://www.topografix.com/GPX/1/1">\n` +
    body +
    `</gpx>\n`;
  return { gpx, skippedTypes: [...skippedTypes] };
}
