/* eslint-disable no-alert */
import { MainLayout } from 'common/layout/main';
import { QueryKey, Role } from 'contants';
import { fileData } from 'dummy';
import { selectRole, selectSalt, selectUserID } from 'features/poc/slices/user';
import {
  getAllFiles,
  getUserEncryptedPrivateKey,
  IFileResponse,
} from 'features/poc/apis/poc';
import { useAppSelector } from 'hooks/useSlice';
import { Button, Card } from 'react-bootstrap';
import { decrypt, signString } from 'util/asym-key';
import { stringTouint8Array, uint8ArrayToString } from 'util/helper';
import {
  decryptDataWithPassword,
  decryptDataWithPasswordWithScrypt,
} from 'util/password-data-key';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Loading } from 'components/skeleton-loader/loading';

export interface IFile {
  id: string;
  title: string;
  image: string;
}

export default function Dashboard() {
  const role = useAppSelector(selectRole);
  const userid = useAppSelector(selectUserID);
  const { isLoading, isError, data } = useQuery<IFileResponse[]>(
    QueryKey.ALL_FILE,
    () => getAllFiles(),
    {
      cacheTime: 10,
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>isError</div>;
  }

  const handleDownloadAction = async (fileTitle: string, fileid: string) => {
    const password = window.prompt('Enter your password');

    // call check challenge API
    const { encryptedPrivateKey, salt, iv } = await getUserEncryptedPrivateKey(
      userid!
    );
    console.log({ encryptedPrivateKey, salt, iv });
    const plainPrivateKey = await decryptDataWithPasswordWithScrypt(
      encryptedPrivateKey,
      password!,
      stringTouint8Array(salt),
      stringTouint8Array(iv)
    );
    console.log('plainPrivateKey');
    console.log(plainPrivateKey);
    const signedFileNameBuffer = await signString(plainPrivateKey, fileTitle);
    // const { encryptedFile, encryptedDataKey } = await getEncryptedFile({
    //   userid,
    //   fileid,
    //   signedFileName: uint8ArrayToString(signedFileNameBuffer),
    // });

    // const datakey = decrypt(plainPrivateKey, encryptedDataKey);
    // decrypt(datakey, encryptedFile);
    // download file
  };

  const handleShareAction = () => {
    // //download
    // const userid = window.prompt('Enter the userid you want to share to');
    // //call api with userid and fileid
    // //return encrypteddatakey of the file and that user's public key
    // const password = window.prompt('Enter password');
    // //enter password to decrypt data key
    // //encrypt datakey with user's public key
    // //call api to upload
  };

  const handleUploadAction = () => {};

  const fileComponents = data!.map((item, index) => (
    <Card
      style={{ width: '18rem', marginTop: 5 }}
      key={`dashboard-card-${index}`}
    >
      <Card.Img
        variant="top"
        src={
          item.thumbnailPath ||
          'https://dummyimage.com/335x333/4ff978/c009e2.png'
        }
      />
      <Card.Body>
        <Card.Text>{item.name}</Card.Text>
        <Button variant="primary">
          {role === Role.AGENCY ? (
            <Button variant="primary" onClick={handleShareAction}>
              share
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => handleDownloadAction(item.name, item.id)}
            >
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
