import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// {
//   "question": "When will an effect run if it doesn't have a dependency array?",
//   "options": [
//     "Only when the component mounts",
//     "Only when the component unmounts",
//     "The first time the component re-renders",
//     "Each time the component is re-rendered"
//   ],
//   "correctOption": 3,
//   "points": 20
// }
