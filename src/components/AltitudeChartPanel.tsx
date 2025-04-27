import React from 'react';
import Chart from './Chart';
import { GeoJSONFeature } from '../store/geojsonStore';

interface AltitudeChartPanelProps {
  feature: GeoJSONFeature | null;
  onHoverIndex?: (idx: number | null) => void;
}

export default function AltitudeChartPanel({ feature, onHoverIndex }: AltitudeChartPanelProps) {
  return (
    <div className="bg-white shadow-lg p-2 md:p-4 border-t w-full max-w-none sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto">
      <div className="text-base md:text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {/* チャートアイコン（折れ線グラフ） */}
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <polyline
            points="4 17 9 11 13 15 20 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="4" cy="17" r="1.5" fill="currentColor" />
          <circle cx="9" cy="11" r="1.5" fill="currentColor" />
          <circle cx="13" cy="15" r="1.5" fill="currentColor" />
          <circle cx="20" cy="7" r="1.5" fill="currentColor" />
        </svg>
        高度グラフ
        <span className="text-xs text-gray-400 ml-2">(標高プロファイル)</span>
      </div>
      <Chart feature={feature} onHoverIndex={onHoverIndex} />
    </div>
  );
}
