import { MainLayout } from 'common/layout/main';
import { Role } from 'contants';
import { fileData } from 'dummy';
import { selectRole } from 'features/poc/slices/role';
import { useAppSelector } from 'hooks/useSlice';
import { Button, Card } from 'react-bootstrap';
import { signstring } from 'util/asym-key';
import { decryptDataWithPassword } from 'util/password-data-key';

export interface IFile {
  title: string;
  image: string;
}

export default function Dashboard() {
  const handleDownloadAction = async () => {
    const password = window.prompt('Enter your password');
    const encryptedPrivate = 'get from server';
    const salt = new Uint8Array(12);
    const plainPrivateKey = await decryptDataWithPassword(
      encryptedPrivate,
      password!,
      salt
    );
    signstring(plainPrivateKey, 'file name');
    // call check challenge API
  };

  const handleShareAction = () => {};

  const handleUploadAction = () => {};

  const role = useAppSelector(selectRole);

  const fileComponents = fileData.map((item, index) => (
    <Card
      style={{ width: '18rem', marginTop: 5 }}
      key={`dashboard-card-${index}`}
    >
      <Card.Img variant="top" src={item.image} />
      <Card.Body>
        <Card.Text>{item.title}</Card.Text>
        <Button variant="primary">
          {role === Role.AGENCY ? (
            <Button variant="primary" onClick={handleShareAction}>
              share
            </Button>
          ) : (
            <Button variant="primary" onClick={handleDownloadAction}>
              download
            </Button>
          )}
        </Button>
      </Card.Body>
    </Card>
  ));
  return (
    <MainLayout>
      {role === Role.AGENCY && (
        <Button variant="primary" className="mt-2" onClick={handleUploadAction}>
          Upload Document
        </Button>
      )}
      <div className="flex flex-row flex-wrap justify-between">
        {fileComponents}
      </div>
    </MainLayout>
  );
}
