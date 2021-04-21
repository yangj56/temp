import { Button, FormControl, InputGroup, Modal } from 'react-bootstrap';

interface Props {
  show: boolean;
  title: string;
  onClose: () => void;
  onEnter: () => void;
  onNricChange: (e: any) => void;
  onEmailChange: (e: any) => void;
  onMobileChange: (e: any) => void;
  onPasswordChange: (e: any) => void;
}

export const InputModal = ({
  show,
  title,
  onClose,
  onEnter,
  onNricChange,
  onEmailChange,
  onMobileChange,
  onPasswordChange,
}: Props) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {' '}
        <InputGroup>
          <FormControl
            id="nric"
            aria-describedby="basic-nric"
            onChange={onNricChange}
            placeholder="NRIC"
            type="text"
          />
        </InputGroup>
        <InputGroup style={{ marginTop: 10 }}>
          <FormControl
            id="email"
            aria-describedby="basic-email"
            onChange={onEmailChange}
            placeholder="Email"
            type="text"
          />
        </InputGroup>
        <InputGroup style={{ marginTop: 10 }}>
          <FormControl
            id="mobile"
            aria-describedby="basic-mobile"
            onChange={onMobileChange}
            placeholder="Mobile number"
            type="text"
          />
        </InputGroup>
        <InputGroup style={{ marginTop: 10 }}>
          <FormControl
            id="password"
            aria-describedby="basic-password"
            onChange={onPasswordChange}
            placeholder="Agency Password"
            type="text"
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onEnter}>
          Enter
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
