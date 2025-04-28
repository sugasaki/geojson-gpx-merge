# geojson-gpx-merge

This is a React application that allows you to merge GeoJSON and GPX files, visualize them on a map, and interact with an elevation graph.

## Main Features

- Upload and merge multiple GeoJSON and GPX files (LineString, Polygon, tracks, etc.)
- Change the order of files via drag-and-drop
- Display merged results on a MapTiler map (API key supported)
- Visualize the elevation (Z value) of merged GeoJSON as a graph
- Hovering over the graph displays a marker at the corresponding point on the map
- Download merged data as GeoJSON or GPX
- Delete files, reorder, and download functionality

## Usage

1. Clone this repository
2. Install dependencies
   ```sh
   pnpm install
   # or npm install
   ```
3. Obtain an API key from MapTiler and set it in a `.env` file
   ```env
   VITE_MAPTILER_KEY=your_api_key
   ```
   - See `.env.sample` for an example
4. Start the development server
   ```sh
   pnpm dev
   # or npm run dev
   ```
5. Access the app at `http://localhost:5173` in your browser

## Tech Stack
- React
- Zustand (state management)
- MapLibre GL / @vis.gl/react-maplibre (map display)
- MapTiler Streets style/API key
- Tailwind CSS (UI)
- recharts (graph)

## Notes
- Do not commit sensitive information such as API keys to `.env`. Use `.env.sample` as a reference.
- Manage unnecessary files like `node_modules` with `.gitignore`.

## License
MIT
