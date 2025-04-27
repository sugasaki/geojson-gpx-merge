import React, { useState } from 'react';
import GeojsonUploader from './components/GeojsonUploader';
import MapView from './components/MapView';
import DownloadButton from './components/DownloadButton';
import Chart from './components/Chart';
import { useGeojsonStore } from './store/geojsonStore';

export default function App() {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">GeoJSON 結合ツール</h1>
      <GeojsonUploader />
      <MapView hoveredIndex={hoveredIndex} />
      <Chart feature={mergedGeojson} onHoverIndex={setHoveredIndex} />
      <DownloadButton />
    </div>
  );
}
