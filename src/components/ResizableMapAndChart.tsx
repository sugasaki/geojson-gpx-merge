import React, { useState } from 'react';
import MapView from './MapView';
import Chart from './Chart';
import { useGeojsonStore } from '../store/geojsonStore';

export default function ResizableMapAndChart({
  hoveredIndex,
  setHoveredIndex
}: {
  hoveredIndex: number | null;
  setHoveredIndex: (idx: number | null) => void;
}) {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);
  const [mapHeightRatio, setMapHeightRatio] = useState(0.7); // map:graph = 7:3 (default)
  const [dragging, setDragging] = useState(false);

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = e.currentTarget.parentElement;
    if (!container) return;
    const totalHeight = container.clientHeight;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    let ratio = y / totalHeight;
    if (ratio < 0.2) ratio = 0.2;
    if (ratio > 0.8) ratio = 0.8;
    setMapHeightRatio(ratio);
  };

  return (
    <div className="flex-1 h-full flex flex-col items-center">
      <div
        className="relative flex flex-col w-full"
        style={{ flexBasis: `${mapHeightRatio * 100}%`, minHeight: 0 }}
      >
        <MapView hoveredIndex={hoveredIndex} />
        {/* ドラッグバー */}
        <div
          className={`absolute bottom-0 left-0 w-full h-3 cursor-row-resize z-10 ${dragging ? 'bg-blue-200' : 'bg-gray-200'}`}
          onMouseDown={() => setDragging(true)}
          style={{ touchAction: 'none' }}
        >
          <div className="mx-auto w-12 h-1 rounded bg-blue-400 mt-1" />
        </div>
      </div>
      {/* 高度グラフ領域 */}
      <div
        className="bg-white shadow-lg p-2 md:p-4 border-t w-full max-w-none sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto"
        style={{ flexBasis: `${(1 - mapHeightRatio) * 100}%`, minHeight: 0 }}
      >
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
        <Chart feature={mergedGeojson} onHoverIndex={setHoveredIndex} />
      </div>
      {/* ドラッグ操作イベントをbodyにバインド */}
      {dragging && (
        <div
          className="fixed inset-0 z-50"
          style={{ cursor: 'row-resize' }}
          onMouseMove={handleDrag}
          onMouseUp={() => setDragging(false)}
        />
      )}
    </div>
  );
}
