# JSON Tree Visualizer
A straightforward way to see your JSON as a connected graph. Paste your JSON, generate the tree, search for paths, and save the view as an image.

## Features
- Generate a node graph from JSON
- Search by JSON path, Eg : user.address.city
- Zoom, pan, fit view
- Minimap and controls
- Able to Download Image of the tree

## Getting Started
1. Install dependencies:

- npm install

2. Start the dev server:

- npm run dev

3. Open "http://localhost:3000" in your browser.

## How it works
- JSON is parsed and turned into React Flow nodes and edges.
- Keys/values become nodes, parent/child connections become edges.
- Search highlights the node for the given path.

## Tips
- Ensure the input is valid JSON.
- For big trees, generate first, then use zoom and the minimap.
- Click any node to copy its JSON path.

## Export
Click "Download Image" The app expands and fits the view, then captures the full graph from top to bottom.

## Tech
- Next.js
- React Flow
- TypeScript
- Tailwind CSS
- html-to-image
