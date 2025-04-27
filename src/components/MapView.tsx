import React, { useMemo, useRef, useEffect } from 'react';
import Map, { Source, Layer, ViewState, MapRef } from '@vis.gl/react-maplibre';
import { useGeojsonStore } from '../store/geojsonStore';
import { getGeojsonBounds } from '../utils/geojsonBounds';

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json';
const INITIAL_VIEW_STATE: Partial<ViewState> = {
  longitude: 139.767,
  latitude: 35.681,
  zoom: 9,
};

const lineLayer = {
  id: 'merged-line',
  type: 'line' as const,
  paint: {
    'line-color': '#ef4444',
    'line-width': 4,
  },
};
const fillLayer = {
  id: 'merged-fill',
  type: 'fill' as const,
  paint: {
    'fill-color': '#3b82f6',
    'fill-opacity': 0.4,
  },
};

// マーカー用レイヤー
const markerLayer = {
  id: 'hover-marker',
  type: 'circle' as const,
  paint: {
    'circle-radius': 8,
    'circle-color': '#ef4444',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff',
  },
};

// hoveredIndex: グラフ上でホバーした点番号
interface MapViewProps {
  hoveredIndex?: number | null;
}

export default function MapView({ hoveredIndex }: MapViewProps) {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);
  const geojsonData = useMemo(() =>
    mergedGeojson ? {
      type: 'FeatureCollection',
      features: [mergedGeojson],
    } : null,
    [mergedGeojson]
  );
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

  // マーカー用GeoJSON生成
  const markerGeojson = useMemo(() => {
    if (!mergedGeojson || hoveredIndex == null) return null;
    let coord: number[] | undefined;
    if (mergedGeojson.geometry.type === 'LineString') {
      coord = mergedGeojson.geometry.coordinates[hoveredIndex];
    } else if (mergedGeojson.geometry.type === 'MultiLineString') {
      const flat = mergedGeojson.geometry.coordinates.flat();
      coord = flat[hoveredIndex];
    } else if (mergedGeojson.geometry.type === 'Polygon') {
      coord = mergedGeojson.geometry.coordinates.flat()[hoveredIndex];
    } else if (mergedGeojson.geometry.type === 'MultiPolygon') {
      coord = mergedGeojson.geometry.coordinates.flat(2)[hoveredIndex];
    }
    if (!coord) return null;
    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: coord },
          properties: {},
        },
      ],
    };
  }, [mergedGeojson, hoveredIndex]);

  return (
    <div className="w-full max-w-2xl h-96 rounded shadow overflow-hidden">
      <Map
        ref={mapRef}
        mapStyle={MAP_STYLE}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
      >
        {geojsonData && (
          <Source id="merged" type="geojson" data={geojsonData}>
            {mergedGeojson && (mergedGeojson.geometry.type === 'Polygon' || mergedGeojson.geometry.type === 'MultiPolygon') ? (
              <Layer {...fillLayer} />
            ) : (
              <Layer {...lineLayer} />
            )}
          </Source>
        )}
        {markerGeojson && (
          <Source id="hover-marker" type="geojson" data={markerGeojson}>
            <Layer {...markerLayer} />
          </Source>
        )}
      </Map>
    </div>
  );
}
