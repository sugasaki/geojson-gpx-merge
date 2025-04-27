import React, { useState } from 'react';
import MapView from './MapView';
import AltitudeChartPanel from './AltitudeChartPanel';
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
      <div style={{ flexBasis: `${(1 - mapHeightRatio) * 100}%`, minHeight: 0, width: '100%' }}>
        <AltitudeChartPanel feature={mergedGeojson} onHoverIndex={setHoveredIndex} />
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
