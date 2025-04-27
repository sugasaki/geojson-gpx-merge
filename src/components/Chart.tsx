import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GeoJSONFeature } from '../store/geojsonStore';

// coordinates: [lng, lat, alt?]
type ChartProps = {
  feature: GeoJSONFeature | null;
  onHoverIndex?: (idx: number | null) => void;
};

export default function Chart({ feature, onHoverIndex }: ChartProps) {
  // 標高データ抽出
  let data: { idx: number; alt: number }[] = [];
  if (feature && feature.geometry.type === 'LineString') {
    data = feature.geometry.coordinates.map((c: any, i: number) => ({
      idx: i,
      alt: typeof c[2] === 'number' ? c[2] : 0,
    }));
  } else if (feature && feature.geometry.type === 'MultiLineString') {
    data = feature.geometry.coordinates.flat().map((c: any, i: number) => ({
      idx: i,
      alt: typeof c[2] === 'number' ? c[2] : 0,
    }));
  }

  return (
    <div className="w-full h-64 bg-white rounded shadow p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          onMouseMove={(state) => {
            if (onHoverIndex) {
              if (state && state.activeTooltipIndex != null) {
                onHoverIndex(state.activeTooltipIndex);
              } else {
                onHoverIndex(null);
              }
            }
          }}
          onMouseLeave={() => onHoverIndex && onHoverIndex(null)}
        >
          <XAxis dataKey="idx" label={{ value: '点番号', position: 'insideBottomRight', offset: -5 }} />
          <YAxis label={{ value: '高度(m)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(v: number) => `${v} m`} />
          <Line type="monotone" dataKey="alt" stroke="#3b82f6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
