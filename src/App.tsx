import { useState } from 'react';
import GeojsonUploader from '@/components/GeojsonUploader';
import DownloadButton from '@/components/DownloadButton';
import ResizableMapAndChart from '@/components/ResizableMapAndChart';
import GithubLink from '@/components/GithubLink';
import { useGeojsonStore } from '@/store/geojsonStore';

export default function App() {
  const mergedGeojson = useGeojsonStore((s) => s.mergedGeojson);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen h-screen max-h-screen bg-gray-50 flex flex-col sm:flex-row overflow-hidden">
      {/* 左側メニュー（スマホでは上部、PCではサイド） */}
      <aside className="w-full sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem] bg-white shadow-lg flex flex-col gap-6 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold">GeoJSON/GPX結合ツール</h1>
        <GeojsonUploader />
        <DownloadButton />
      </aside>
      {/* 右側地図＋グラフ（スマホでは下部、PCでは右側） */}
      <main className="flex-1 h-full flex flex-col">
        <ResizableMapAndChart hoveredIndex={hoveredIndex} setHoveredIndex={setHoveredIndex} />
      </main>
      <GithubLink />
    </div>
  );
}
