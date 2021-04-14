/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { MainLayout } from 'common/layout/main';
import { Loading } from 'components/skeleton-loader/loading';
import { QueryKey, Role } from 'contants';
import {
  getAllFiles,
  getEncryptedDataKey,
  getEncryptedFile,
  getUserEncryptedPrivateKey,
  IFileResponse,
  uploadEncryptedFile,
} from 'features/poc/apis/poc';
import {
  selectIV,
  selectRole,
  selectSalt,
  selectUserID,
} from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { useState, useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useQuery } from 'react-query';
import { base64StringToArrayBuffer } from 'util/helper';
import { decryptDataWithPasswordWithScrypt } from 'util/password-data-key';
import { decryptWithCryptoKey, importPrivateKey } from 'util/asymmetric-key';

export interface IFile {
  id: string;
  title: string;
  image: string;
}

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState();
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const role = useAppSelector(selectRole);
  const userid = useAppSelector(selectUserID);
  const iv = useAppSelector(selectIV);
  const salt = useAppSelector(selectSalt);
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

  const validateInput = () => {
    if (!role || !userid || !iv || !salt) {
      return true;
    }
    return true;
  };

  const handleDownloadAction = async (fileID: string) => {
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }
    console.log('Start download');
    const password = window.prompt('Enter your password');

    const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);

    console.log({ encryptedPrivateKey, salt, iv });
    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;
    const privateKeyPem = await decryptDataWithPasswordWithScrypt(
      password!,
      encryptedPrivateKey,
      saltUint,
      ivUint
    );

    console.log('privateKeyPem');
    console.log(privateKeyPem);

    const fileBlob = await getEncryptedFile(fileID);
    console.log(fileBlob);
    const encryptedDataKey = await getEncryptedDataKey(fileID, userid);
    const privateKey = importPrivateKey;
    // const decryptedBob = decryptWithCryptoKey();

    // const signedFileNameBuffer = await signString(plainPrivateKey, fileTitle);
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
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }
    console.log('Start sharing');
    // //download
    // const userid = window.prompt('Enter the userid you want to share to');
    // //call api with userid and fileid
    // //return encrypteddatakey of the file and that user's public key
    // const password = window.prompt('Enter password');
    // //enter password to decrypt data key
    // //encrypt datakey with user's public key
    // //call api to upload
  };

  const handleOnFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadAction = () => {
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }

    if (hiddenFileInputRef.current !== null) {
      hiddenFileInputRef.current.click();
    }
    console.log('Start uploading');
  };

  const handleUploadedFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'gordon');
    formData.append('encryptedDataKey', 'testing from gordon');
    // const config = {
    //   headers: {
    //     'content-type': 'multipart/form-data',
    //   }
    // };
    uploadEncryptedFile(formData);
  };

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    console.log('Start file on change');
    // setSelectedFile(e.target.files[0]);
    handleUploadedFile(e.target.files[0]);
  };

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
              onClick={() => handleDownloadAction(item.id)}
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
        <>
          <Button
            variant="primary"
            className="mt-2"
            onClick={handleUploadAction}
          >
            Upload Document
          </Button>
          <input
            type="file"
            ref={hiddenFileInputRef}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFileOnChange}
          />
        </>
      )}
      <div className="flex flex-row flex-wrap justify-between">
        {fileComponents}
      </div>
    </MainLayout>
  );
}
