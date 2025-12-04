import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Set default theme to dark if not already set
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'dark');
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);