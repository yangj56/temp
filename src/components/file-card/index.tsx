import React from 'react';
import { Card, Button } from 'react-bootstrap';

import FileImage from 'assets/file-image2.jpeg';
import { Role } from '../../contants';

interface Props {
  name: string;
  size?: string;
  sharer?: string;
  thumbnailPath: string;
  onDownload: () => void;
  onShare: () => void;
  onImageClick?: () => void;
  onGetSharees?: () => void;
  role: string;
}

export const FileCard = ({
  name,
  size,
  sharer,
  thumbnailPath,
  onDownload,
  onShare,
  onImageClick,
  onGetSharees,
  role,
}: Props) => {
  return (
    <Card
      style={{
        width: '20rem',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px',
        }}
      >
        <Card.Img
          variant="top"
          src={FileImage}
          style={{
            height: '10rem',
            width: '10rem',
            cursor: 'pointer',
          }}
          onClick={onImageClick}
        />
      </div>
      <Card.Body>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Card.Text>Name: {name}</Card.Text>
            {size && <Card.Text>Size: {size}</Card.Text>}
          </div>
          {sharer && (
            <Card.Text>
              Shared by: <br />
              {sharer}
            </Card.Text>
          )}
        </div>

        <div className="flex flex-row justify-between">
          <Button variant="primary" onClick={onDownload}>
            download
          </Button>
          {role === Role.AGENCY ? (
            <>
              <Button variant="primary" onClick={onShare}>
                share
              </Button>
              <Button variant="primary" onClick={onGetSharees}>
                view Sharee
              </Button>
            </>
          ) : null}
        </div>
      </Card.Body>
    </Card>
  );
};
