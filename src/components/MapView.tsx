import { useMemo, useRef, useEffect } from 'react';
import Map, { Source, Layer, ViewState, MapRef } from '@vis.gl/react-maplibre';
import { useGeojsonStore, GeoJSONFeature } from '@/store/geojsonStore';
import { getGeojsonBounds } from '@/utils/geojsonBounds';

// MapTiler Streets スタイル
const MAP_STYLE = `https://api.maptiler.com/maps/streets/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`;
const INITIAL_VIEW_STATE: Partial<ViewState> = {
  longitude: 139.767,
  latitude: 35.681,
  zoom: 9,
};

const lineLayer = {
  id: 'merged-line',
  type: 'line' as const,
  filter: ['in', ['get', '_geomType'], ['literal', ['LineString', 'MultiLineString']]] as any,
  paint: {
    'line-color': '#ef4444',
    'line-width': 4,
  },
};

const fillLayer = {
  id: 'merged-fill',
  type: 'fill' as const,
  filter: ['in', ['get', '_geomType'], ['literal', ['Polygon', 'MultiPolygon']]] as any,
  paint: {
    'fill-color': '#3b82f6',
    'fill-opacity': 0.4,
  },
};

const pointLayer = {
  id: 'merged-point',
  type: 'circle' as const,
  filter: ['in', ['get', '_geomType'], ['literal', ['Point', 'MultiPoint']]] as any,
  paint: {
    'circle-radius': 6,
    'circle-color': '#f59e0b',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff',
  },
};

const pointLabelLayer = {
  id: 'merged-point-label',
  type: 'symbol' as const,
  filter: ['in', ['get', '_geomType'], ['literal', ['Point', 'MultiPoint']]] as any,
  layout: {
    'text-field': ['get', 'name'] as any,
    'text-size': 12,
    'text-offset': [0, 1.5] as [number, number],
    'text-anchor': 'top' as const,
  },
  paint: {
    'text-color': '#374151',
    'text-halo-color': '#fff',
    'text-halo-width': 1,
  },
};

// マーカー用レイヤー
const hoverMarkerLayer = {
  id: 'hover-marker',
  type: 'circle' as const,
  paint: {
    'circle-radius': 8,
    'circle-color': '#ef4444',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff',
  },
};

function extractLineCoords(features: GeoJSONFeature[]): number[][] {
  const coords: number[][] = [];
  for (const f of features) {
    if (f.geometry.type === 'LineString') {
      coords.push(...f.geometry.coordinates);
    } else if (f.geometry.type === 'MultiLineString') {
      coords.push(...f.geometry.coordinates.flat());
    }
  }
  return coords;
}

interface MapViewProps {
  hoveredIndex?: number | null;
}

export default function MapView({ hoveredIndex }: MapViewProps) {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);

  // _geomType プロパティを付与してフィルタリング可能にする
  const geojsonData = useMemo(() => {
    if (!mergedGeojson) return null;
    return {
      type: 'FeatureCollection' as const,
      features: mergedGeojson.features.map((f) => ({
        ...f,
        properties: { ...f.properties, _geomType: f.geometry.type },
      })),
    };
  }, [mergedGeojson]);

  const mapRef = useRef<MapRef>(null);

  // GeoJSON領域でバウンド
  useEffect(() => {
    if (!mergedGeojson || !mapRef.current) return;
    const bounds = getGeojsonBounds(mergedGeojson);
    if (!bounds) return;
    mapRef.current.fitBounds([
      [bounds[0], bounds[1]],
      [bounds[2], bounds[3]],
    ], { padding: 40, duration: 500 } as any);
  }, [mergedGeojson]);

  // マーカー用GeoJSON生成（LineString系の座標からhoveredIndexで取得）
  const markerGeojson = useMemo(() => {
    if (!mergedGeojson || hoveredIndex == null) return null;
    const lineCoords = extractLineCoords(mergedGeojson.features);
    const coord = lineCoords[hoveredIndex];
    if (!coord) return null;
    return {
      type: 'FeatureCollection' as const,
      features: [
        {
          type: 'Feature' as const,
          geometry: { type: 'Point' as const, coordinates: coord },
          properties: {},
        },
      ],
    };
  }, [mergedGeojson, hoveredIndex]);

  return (
    <div
      className="w-full h-[40vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] max-w-full rounded shadow overflow-hidden"
      style={{ minHeight: 240 }}
    >
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
      >
        {geojsonData && (
          <Source id="merged" type="geojson" data={geojsonData}>
            <Layer {...lineLayer} />
            <Layer {...fillLayer} />
            <Layer {...pointLayer} />
            <Layer {...pointLabelLayer} />
          </Source>
        )}
        {markerGeojson && (
          <Source id="hover-marker" type="geojson" data={markerGeojson}>
            <Layer {...hoverMarkerLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
}
