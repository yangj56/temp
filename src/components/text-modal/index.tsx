import { Button, Modal } from 'react-bootstrap';
import React from 'react';

interface Props {
  show: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const TextModal = ({ show, title, children, onClose }: Props) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
