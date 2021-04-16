import { Col, Container, Modal, Row } from 'react-bootstrap';
import ClipLoader from 'react-spinners/ClipLoader';

type Props = {
  loading: boolean;
  text?: string;
};

export const LoadingSpinner = ({ loading, text = 'Loading' }: Props) => {
  return (
    <Modal centered show={loading} size="sm" backdropClassName="bg-gray-300">
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={6} md={8}>
              {text}
            </Col>
            <Col xs={6} md={4}>
              <ClipLoader color="#F87171" loading size={50} />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};
