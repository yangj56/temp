/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { MainLayout } from 'common/layout/main';
import { Loading } from 'components/skeleton-loader/loading';
import { QueryKey, Role } from 'contants';
import {
  addEncryptedDataKey,
  getAllFiles,
  getEncryptedDataKey,
  getEncryptedFile,
  getUserEncryptedPrivateKey,
  getUserPublicKeyAndFileDatakey,
  IFileResponse,
  uploadEncryptedFile,
} from 'features/poc/apis/poc';
import {
  selectIV,
  selectRole,
  selectSalt,
  selectUserID,
  selectPublicKey,
} from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { useState, useRef } from 'react';
import { Button, Card } from 'react-bootstrap';
import { useQuery } from 'react-query';
import {
  arrayBufferToBase64,
  base64StringToArrayBuffer,
  generateIV,
} from 'util/helper';
import { decryptDataWithPasswordWithScrypt } from 'util/password-data-key';
import {
  decryptWithCryptoKey,
  encryptWithCryptoKey,
  importPrivateKey,
  importPublicKey,
} from 'util/asymmetric-key';
import {
  generateSymKeyPair,
  encryptWithSymmetricKey,
  decryptWithSymmetricKey,
  importSymmtricKey,
  exportSymmtricKey,
} from 'util/symmetric-key';
import { LoadingClip } from 'components/modal/loading';

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
  const publicKey = useAppSelector(selectPublicKey);

  const { isLoading, isError, data } = useQuery<IFileResponse[]>(
    QueryKey.ALL_FILE,
    () => getAllFiles(),
    {
      cacheTime: 10,
    }
  );

  if (isLoading) {
    return <LoadingClip loading />;
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

    console.log('encryptedPrivateKey');
    console.log(encryptedPrivateKey);

    console.log({ encryptedPrivateKey, salt, iv });
    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;
    const privateKeyString = await decryptDataWithPasswordWithScrypt(
      password!,
      encryptedPrivateKey,
      saltUint,
      ivUint
    );

    console.log('privateKeyString');
    console.log(privateKeyString);

    // const fileBlob: Blob = await getEncryptedFile(fileID);
    // const fileBlobString = await fileBlob.text();
    // console.log(fileBlob);
    // const encryptedDataKey = await getEncryptedDataKey(fileID, userid);
    // const importedPrivateKey = await importPrivateKey(privateKeyString);
    // const dataKeyString = await decryptWithCryptoKey(
    //   importedPrivateKey!,
    //   encryptedDataKey.key
    // );
    // const importedDataKey = await importSymmtricKey(dataKeyString!);
    // const ivDataKey = base64StringToArrayBuffer(
    //   encryptedDataKey.iv
    // ) as Uint8Array;
    // const decryptedFileString = await decryptWithSymmetricKey(
    //   importedDataKey!,
    //   fileBlobString,
    //   ivDataKey
    // );

    // const decryptedFileBuffer = base64StringToArrayBuffer(decryptedFileString!);
    // const decryptedBlob = new Blob([new Uint8Array(decryptedFileBuffer)]);
    // const url = window.URL.createObjectURL(decryptedBlob);
    // console.log('------url-----------');
    // console.log(url);
  };

  const handleShareAction = async (fileID: string) => {
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }
    console.log('Start sharing');
    // //download
    const receiverId = window.prompt('Enter the userid you want to share to');
    const password = window.prompt('Enter password');
    const response = await getUserPublicKeyAndFileDatakey(
      fileID,
      userid,
      receiverId!
    );

    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;
    const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);

    const plainPrivateKey = await decryptDataWithPasswordWithScrypt(
      password!,
      encryptedPrivateKey,
      saltUint,
      ivUint
    );

    const importedPrivateKey = await importPrivateKey(plainPrivateKey);
    const fileIVVal = base64StringToArrayBuffer(response.iv) as Uint8Array;
    const dataKey = await decryptWithSymmetricKey(
      importedPrivateKey!,
      response.encryptedDataKey,
      fileIVVal
    );

    const importedPublicKey = await importSymmtricKey(response.publicKey!);
    const receiverEncryptedDataKey = await encryptWithCryptoKey(
      importedPublicKey!,
      dataKey!
    );

    const res = await addEncryptedDataKey({
      encryptedDataKey: receiverEncryptedDataKey!,
      fileId: fileID,
      userId: receiverId!,
    });

    console.log('finished sharing');
    console.log(res);
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

  const handleUploadedFile = async (file: File) => {
    const { name, type } = file;
    const dataIv = generateIV();
    const dataKey = (await generateSymKeyPair())!;
    const dataInText = await file.text();
    const encryptedData = (await encryptWithSymmetricKey(
      dataKey,
      dataInText,
      dataIv
    ))!;

    const importedPublicKey = (await importPublicKey(publicKey))!;
    const exportedDataKey = (await exportSymmtricKey(dataKey))!;
    const encryptedDataKey = (await encryptWithCryptoKey(
      importedPublicKey,
      exportedDataKey
    )) as string;

    const formData = new FormData();
    console.log({
      encryptedData,
      userid,
      encryptedDataKey,
      is: arrayBufferToBase64(dataIv),
    });

    const encryptedDataBuffer = base64StringToArrayBuffer(encryptedData!);
    const encryptedDataBlob = new Blob([new Uint8Array(encryptedDataBuffer)]);
    formData.append('file', new File([encryptedDataBlob], name, { type }));
    formData.append('userId', userid);
    formData.append('encryptedDataKey', encryptedDataKey);
    formData.append('iv', arrayBufferToBase64(dataIv));
    console.log(formData);
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
            <Button
              variant="primary"
              onClick={() => handleShareAction(item.id)}
            >
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
      {isError && <div>isError</div>}
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
