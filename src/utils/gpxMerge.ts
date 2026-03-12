/**
 * 複数のGPX XMLテキストをXMLレベルでマージする
 * 元のデータ（extensions, namespace等）を完全に保持する
 */
export function mergeGpxTexts(gpxTexts: string[]): string {
  if (gpxTexts.length === 0) return '';
  if (gpxTexts.length === 1) return gpxTexts[0];

  const parser = new DOMParser();

  const namespaces = new Map<string, string>();
  // ルート要素のその他属性（xsi:schemaLocation等）を保持
  const rootAttrs = new Map<string, string>();
  // 最初のtrkのメタデータ（trkseg以外の子要素）
  const trkMetaElements: string[] = [];
  const trksegElements: string[] = [];
  const rteElements: string[] = [];
  const wptElements: string[] = [];
  const metadataElements: string[] = [];

  let creator = 'gpx-merge';
  let trkMetaCaptured = false;

  for (let i = 0; i < gpxTexts.length; i++) {
    const doc = parser.parseFromString(gpxTexts[i], 'application/xml');
    const gpxEl = doc.documentElement;

    if (i === 0 && gpxEl.getAttribute('creator')) {
      creator = gpxEl.getAttribute('creator')!;
    }

    // ルート属性を収集
    for (let j = 0; j < gpxEl.attributes.length; j++) {
      const attr = gpxEl.attributes[j];
      if (attr.name.startsWith('xmlns:')) {
        const existing = namespaces.get(attr.name);
        if (existing && existing !== attr.value) {
          throw new Error(
            `GPX namespace prefix conflict for "${attr.name}": "${existing}" vs "${attr.value}"`
          );
        }
        if (!existing) {
          namespaces.set(attr.name, attr.value);
        }
      } else if (attr.name !== 'version' && attr.name !== 'creator' && attr.name !== 'xmlns') {
        // version, creator, xmlnsは別途出力するため除外
        // 最初のファイルの属性を優先（上書きしない）
        if (!rootAttrs.has(attr.name)) {
          rootAttrs.set(attr.name, attr.value);
        }
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

    // gpx直下の子要素を走査
    for (const child of Array.from(gpxEl.childNodes)) {
      if (child.nodeType !== 1) continue;
      const el = child as Element;
      const tag = el.tagName;
      if (tag === 'trk') {
        // trk直下の子ノードを走査
        for (const trkChild of Array.from(el.childNodes)) {
          if (trkChild.nodeType !== 1) continue;
          const trkChildEl = trkChild as Element;
          if (trkChildEl.tagName === 'trkseg') {
            trksegElements.push(nodeToString(trkChildEl, gpxEl));
          } else if (!trkMetaCaptured) {
            // 最初のtrkのメタデータ要素を保持
            trkMetaElements.push(nodeToString(trkChildEl, gpxEl));
          }
        }
        if (!trkMetaCaptured) trkMetaCaptured = true;
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
  gpx += `<gpx version="1.1" creator="${escapeXmlAttr(creator)}"\n`;
  gpx += `     xmlns="http://www.topografix.com/GPX/1/1"`;
  if (nsDecls) gpx += `\n     ${nsDecls}`;
  // その他のルート属性（xsi:schemaLocation等）
  for (const [name, value] of rootAttrs) {
    gpx += `\n     ${name}="${escapeXmlAttr(value)}"`;
  }
  gpx += `>\n`;

  for (const m of metadataElements) gpx += `  ${m}\n`;
  for (const w of wptElements) gpx += `  ${w}\n`;
  for (const r of rteElements) gpx += `  ${r}\n`;
  if (trksegElements.length > 0 || trkMetaElements.length > 0) {
    gpx += `  <trk>\n`;
    for (const meta of trkMetaElements) gpx += `    ${meta}\n`;
    for (const ts of trksegElements) gpx += `    ${ts}\n`;
    gpx += `  </trk>\n`;
  }

  gpx += `</gpx>\n`;
  return gpx;
}

/**
 * XML属性値をエスケープする
 */
function escapeXmlAttr(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
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
