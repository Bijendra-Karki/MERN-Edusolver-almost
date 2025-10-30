import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { pdfjs } from 'react-pdf';

// THE FIX: Set the path to the worker file provided by the package
// This path is reliable across most modern bundlers (CRA, Vite, Next.js 'public' folder)
// 💡 THE FIX: Point to the worker script in your public folder.
// When using a public folder, paths are relative to the root URL (e.g., http://localhost:5173/pdf.worker.min.js).
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// Wrap your entire app with the provider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
