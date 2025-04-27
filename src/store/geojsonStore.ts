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
  mergedGeojson: GeoJSONFeature | null;
  setMergedGeojson: (feature: GeoJSONFeature | null) => void;
}

export const useGeojsonStore = create<GeojsonState>((set) => ({
  mergedGeojson: null,
  setMergedGeojson: (feature) => set({ mergedGeojson: feature }),
}));
