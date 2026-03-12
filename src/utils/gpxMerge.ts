/**
 * 複数のGPX XMLテキストをXMLレベルでマージする
 * 元のデータ（extensions, namespace等）を完全に保持する
 */
export function mergeGpxTexts(gpxTexts: string[]): string {
  if (gpxTexts.length === 0) return '';
  if (gpxTexts.length === 1) return gpxTexts[0];

  const parser = new DOMParser();

  // 全GPXからnamespace宣言、trk, rte, wpt要素を収集
  const namespaces = new Map<string, string>();
  const trksegElements: string[] = [];
  const rteElements: string[] = [];
  const wptElements: string[] = [];
  const metadataElements: string[] = [];

  // 最初のGPXのcreator属性を使用
  let creator = 'gpx-merge';

  for (let i = 0; i < gpxTexts.length; i++) {
    const doc = parser.parseFromString(gpxTexts[i], 'application/xml');
    const gpxEl = doc.documentElement;

    if (i === 0 && gpxEl.getAttribute('creator')) {
      creator = gpxEl.getAttribute('creator')!;
    }

    // namespace宣言を収集
    for (let j = 0; j < gpxEl.attributes.length; j++) {
      const attr = gpxEl.attributes[j];
      if (attr.name.startsWith('xmlns:')) {
        namespaces.set(attr.name, attr.value);
      }
    }

    // metadata (最初のファイルのみ)
    if (i === 0) {
      for (const child of Array.from(gpxEl.childNodes)) {
        if (child.nodeType === 1 && (child as Element).tagName === 'metadata') {
          metadataElements.push(nodeToString(child as Element, gpxEl));
        }
      }
    }

    // trk内のtrkseg, rte, wpt要素を収集（直接の子要素のみ）
    for (const child of Array.from(gpxEl.childNodes)) {
      if (child.nodeType !== 1) continue;
      const el = child as Element;
      const tag = el.tagName;
      if (tag === 'trk') {
        const trksegs = el.getElementsByTagName('trkseg');
        for (let j = 0; j < trksegs.length; j++) {
          trksegElements.push(nodeToString(trksegs[j], gpxEl));
        }
      } else if (tag === 'rte') {
        rteElements.push(nodeToString(el, gpxEl));
      } else if (tag === 'wpt') {
        wptElements.push(nodeToString(el, gpxEl));
      }
    }
  }

  // namespace宣言を構築
  const nsDecls = Array.from(namespaces.entries())
    .map(([name, value]) => `${name}="${value}"`)
    .join('\n     ');

  // GPXドキュメントを構築
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  gpx += `<gpx version="1.1" creator="${creator}"\n`;
  gpx += `     xmlns="http://www.topografix.com/GPX/1/1"`;
  if (nsDecls) gpx += `\n     ${nsDecls}`;
  gpx += `>\n`;

  for (const m of metadataElements) gpx += `  ${m}\n`;
  for (const w of wptElements) gpx += `  ${w}\n`;
  for (const r of rteElements) gpx += `  ${r}\n`;
  if (trksegElements.length > 0) {
    gpx += `  <trk>\n`;
    for (const ts of trksegElements) gpx += `    ${ts}\n`;
    gpx += `  </trk>\n`;
  }

  gpx += `</gpx>\n`;
  return gpx;
}

/**
 * 要素をシリアライズし、ルート要素で既に宣言済みのnamespace宣言を子要素から除去する
 */
function nodeToString(el: Element, gpxRoot: Element): string {
  const serializer = new XMLSerializer();
  let str = serializer.serializeToString(el);

  // ルート要素のデフォルトnamespace宣言を子要素から除去
  const defaultNs = gpxRoot.getAttribute('xmlns');
  if (defaultNs) {
    str = str.replaceAll(` xmlns="${defaultNs}"`, '');
  }

  // ルート要素のプレフィックス付きnamespace宣言を子要素から除去
  for (let i = 0; i < gpxRoot.attributes.length; i++) {
    const attr = gpxRoot.attributes[i];
    if (attr.name.startsWith('xmlns:')) {
      str = str.replaceAll(` ${attr.name}="${attr.value}"`, '');
    }
  }

  return str;
}
