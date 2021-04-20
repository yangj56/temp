import React from 'react';
import { Card, Button } from 'react-bootstrap';

import { Role } from '../../contants';

interface Props {
  name: string;
  thumbnailPath: string;
  onDownload: () => void;
  onShare: () => void;
  onImageClick?: () => void;
  role: string;
}

export const FileCard = ({
  name,
  thumbnailPath,
  onDownload,
  onShare,
  onImageClick,
  role,
}: Props) => {
  return (
    <Card style={{ width: '18rem', marginTop: 10, marginBottom: 10 }}>
      <Card.Img
        variant="top"
        src={
          thumbnailPath || 'https://dummyimage.com/335x333/4ff978/c009e2.png'
        }
        style={{ height: '15rem', cursor: 'pointer' }}
        onClick={onImageClick}
      />
      <Card.Body>
        <Card.Text>Name: {name}</Card.Text>
        <div className="flex flex-row justify-between">
          <Button variant="primary" onClick={onDownload}>
            download
          </Button>
          {role === Role.AGENCY ? (
            <Button variant="primary" onClick={onShare}>
              share
            </Button>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};
