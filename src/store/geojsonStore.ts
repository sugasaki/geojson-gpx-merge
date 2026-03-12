import { create } from 'zustand';

export type GeoJSONFeature = {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: Record<string, any>;
};

export type GeoJSON = {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
};

interface GeojsonState {
  mergedGeojson: GeoJSON | null;
  setMergedGeojson: (fc: GeoJSON | null) => void;
}

export const useGeojsonStore = create<GeojsonState>((set) => ({
  mergedGeojson: null,
  setMergedGeojson: (fc) => set({ mergedGeojson: fc }),
}));
