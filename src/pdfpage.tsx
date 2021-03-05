import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

const max = 5;
const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
};

export default function MyApp() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  function goToNextPage() {
    if (pageNumber === max) {
      setPageNumber(1);
      return;
    }
    setPageNumber((pageNumber + 1) % (max + 1));
  }

  return (
    <div>
      <Document
        file={{
          url:
            "https://thisisatestsiteplzignore.s3-ap-southeast-1.amazonaws.com/welcome.pdf",
        }}
        renderMode={"svg"}
        onLoadSuccess={onDocumentLoadSuccess}
        options={options}
      >
        <Page
          pageNumber={pageNumber}
          renderAnnotationLayer={true}
          renderTextLayer={true}
          renderInteractiveForms={true}
        ></Page>
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button onClick={goToNextPage}>GO NEXT</button>
    </div>
  );
}
