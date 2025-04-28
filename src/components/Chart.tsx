import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { GeoJSONFeature } from '../store/geojsonStore';

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // 地球半径[m]
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// coordinates: [lng, lat, alt?]
type ChartProps = {
  feature: GeoJSONFeature | null;
  onHoverIndex?: (idx: number | null) => void;
};

export default function Chart({ feature, onHoverIndex }: ChartProps) {
  // 標高データと累積距離を抽出
  let data: { idx: number; alt: number; distance: number }[] = [];
  if (feature && feature.geometry.type === 'LineString') {
    const coords = feature.geometry.coordinates;
    let sum = 0;
    data = coords.map((c: any, i: number) => {
      let d = 0;
      if (i > 0) {
        d = haversine(coords[i-1][1], coords[i-1][0], c[1], c[0]);
      }
      sum += d;
      return {
        idx: i,
        alt: typeof c[2] === 'number' ? c[2] : 0,
        distance: +(sum / 1000).toFixed(3) // km単位, 小数3桁
      };
    });
  } else if (feature && feature.geometry.type === 'MultiLineString') {
    const coords = feature.geometry.coordinates.flat();
    let sum = 0;
    data = coords.map((c: any, i: number) => {
      let d = 0;
      if (i > 0) {
        d = haversine(coords[i-1][1], coords[i-1][0], c[1], c[0]);
      }
      sum += d;
      return {
        idx: i,
        alt: typeof c[2] === 'number' ? c[2] : 0,
        distance: +(sum / 1000).toFixed(3) // km単位, 小数3桁
      };
    });
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
          <XAxis
            dataKey="distance"
            type="number"
            domain={['dataMin', data.length > 0 ? data[data.length - 1].distance + 0.05 : 'dataMax']}
            label={{ value: '距離(km)', position: 'insideBottomRight', offset: -5 }}
            tickFormatter={v => v.toFixed(2)}
          />
          <YAxis label={{ value: '高度(m)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(v: number, name: string) => name === 'distance' ? `${v.toFixed(3)} km` : `${v} m`} />
          <Line type="monotone" dataKey="alt" stroke="#3b82f6" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
