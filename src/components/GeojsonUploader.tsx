import React, { useRef, useState } from 'react';
import { useGeojsonStore, GeoJSON } from '@/store/geojsonStore';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { mergeGeojsons } from '@/utils/geojsonMerge';
import { fileToGeojson } from '@/utils/fileToGeojson';

type FileItem = {
  file: File;
  name: string;
  geojson: GeoJSON;
};

// アップロード用アイコンSVG
const UploadIcon = () => (
  <svg className="w-12 h-12 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 48">
    <path strokeLinecap="round" strokeLinejoin="round" d="M24 34V14m0 0l-8 8m8-8l8 8" />
    <rect x="8" y="34" width="32" height="6" rx="3" fill="currentColor" opacity=".2" />
  </svg>
);

export default function GeojsonUploader() {
  const setMergedGeojson = useGeojsonStore((s) => s.setMergedGeojson);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileItems, setFileItems] = useState<FileItem[]>([]);

  // ファイル追加
  const handleFilesProcess = async (files: FileList | null) => {
    if (!files) return;
    const newItems: FileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const geojson = await fileToGeojson(file);
      if (geojson) {
        newItems.push({ file, name: file.name, geojson });
      } else if (file.name.toLowerCase().endsWith('.gpx')) {
        alert('GPXファイルの読み込みに失敗しました: ' + file.name);
      }
    }
    const mergedList = [...fileItems, ...newItems];
    setFileItems(mergedList);
    setMergedGeojson(mergeGeojsons(mergedList.map(f => f.geojson)));
  };

  // ファイル削除
  const removeItem = (idx: number) => {
    const updated = fileItems.filter((_, i) => i !== idx);
    setFileItems(updated);
    setMergedGeojson(mergeGeojsons(updated.map(f => f.geojson)));
  };

  // input change
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesProcess(e.target.files);
  };

  // ドラッグ＆ドロップイベント（アップロード用）
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesProcess(e.dataTransfer.files);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  // すべて削除（確認なし）
  const clearAll = () => {
    setFileItems([]);
    setMergedGeojson(null);
  };

  // 並び替え（DnD）
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const updated = Array.from(fileItems);
    const [removed] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, removed);
    setFileItems(updated);
    setMergedGeojson(mergeGeojsons(updated.map(f => f.geojson)));
  };

  return (
    <div className="w-full max-w-md">
      <div
        className={`border-2 border-dashed rounded-lg transition-all duration-200 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100'} cursor-pointer mb-4 flex flex-col items-center justify-center min-h-[140px] md:min-h-[180px] px-4 py-8`}
        onClick={handleAreaClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        style={{ userSelect: 'none' }}
      >
        <UploadIcon />
        <div className="text-lg font-semibold text-gray-700 mb-1">ファイルをここにドラッグ＆ドロップ</div>
        <div className="text-sm text-gray-500">またはクリックして選択</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".geojson,.gpx,application/geo+json,application/json,application/gpx+xml"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>
      {/* すべて削除ボタン */}
      <div className="flex justify-end mb-2">
        <button
          className="px-3 py-1 text-xs bg-red-500 text-white rounded shadow disabled:opacity-50"
          onClick={clearAll}
          disabled={fileItems.length === 0}
        >
          すべて削除
        </button>
      </div>
      {/* ファイルリストとドラッグ並び替えUI */}
      {fileItems.length > 0 && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="geojson-list">
            {(provided) => (
              <ul
                className="mt-4 space-y-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {fileItems.map((item, idx) => (
                  <Draggable key={item.name + idx} draggableId={item.name + idx} index={idx}>
                    {(prov, snapshot) => (
                      <li
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className={`flex items-center gap-2 bg-gray-100 px-3 py-2 rounded shadow-sm border ${snapshot.isDragging ? 'border-blue-400' : 'border-transparent'}`}
                      >
                        <span className="flex-1 truncate cursor-move">{idx + 1}. {item.name}</span>
                        <button
                          className="px-2 py-1 text-xs bg-red-400 text-white rounded"
                          onClick={() => removeItem(idx)}
                          title="削除"
                        >✕</button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
