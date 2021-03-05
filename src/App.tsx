import React from "react";
import "./App.css";
import PDFPage from "./pdfpage";

function App() {
  const passValue = () => {
    console.log("passing value backing to agency");
    window.parent.postMessage("filesg-1234", "*");
  };
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={passValue}>
          passing value back to agency webpage
        </button>
        <p>Demo pdf display with s3 link</p>
        <PDFPage />
      </header>
    </div>
  );
}

export default App;
