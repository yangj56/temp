import { PDFDocumentProxy } from 'pdfjs-dist/types/display/api';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Document, Page } from 'react-pdf';

interface Props {
  file: any;
  onClose: () => void;
}

export default function PdfViewer({ file, onClose }: Props) {
  const [numberPages, setNumberPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy) {
    setNumberPages(numPages);
  }

  return (
    <Modal
      show
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onClose}
      scrollable={false}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      {/* <Modal.Body> */}
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numberPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      {/* <p>lalalal</p> */}
      {/* </Modal.Body> */}
      <Modal.Footer>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
