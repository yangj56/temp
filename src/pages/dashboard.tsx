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

    // 1. Get user's encrypted private key
    const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);
    console.log('encryptedPrivateKey');
    console.log(encryptedPrivateKey);

    // 2. Enter password to generate password key with scrypt and decrypt the private key with password key
    console.log({ encryptedPrivateKey, salt, iv });
    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;
    const privateKeyString = await decryptDataWithPasswordWithScrypt(
      password!,
      encryptedPrivateKey,
      saltUint,
      ivUint
    );

    // 3. Import the base64 private key into a CryptoKey
    const importedPrivateKey = await importPrivateKey(privateKeyString);

    // 4. Get encrypted file
    const encryptedFile: Blob = await getEncryptedFile(fileID);

    // 5. Get encrypted data key and iv with userId and fileId
    const { key: encryptedDataKey, iv: fileIV } = (
      await getEncryptedDataKey(fileID, userid)
    )[0];
    const fileIvVal = base64StringToArrayBuffer(fileIV) as Uint8Array;

    // 6. Decrypt the encrypted data key with the imported private key
    const dataKeyInBase64 = await decryptWithCryptoKey(
      importedPrivateKey!,
      encryptedDataKey
    );

    console.log('importedPrivateKey', importedPrivateKey!);
    console.log('encryptedDataKey', encryptedDataKey);

    // // 7. Import the base64 data key into CryptoKey
    // const importedDataKey = await importSymmtricKey(dataKeyInBase64!);

    // // 8. Convert the file back to text
    // const dataInText = await encryptedFile.text();

    // // 9. Decrypt the file with the data key and iv
    // const decryptedFile = await decryptWithSymmetricKey(
    //   importedDataKey!,
    //   dataInText,
    //   fileIvVal
    // );

    // // 10. Convert the file string back to Blob
    // const dataFile = new File([decryptedFile!], 'lala.png', {
    //   type: 'application/pdf',
    // });

    // console.log('datafile', dataFile);

    // console.log('privateKeyString');
    // console.log(privateKeyString);

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
    const receiverId = window.prompt('Enter the userid you want to share to'); // Get the id of user (citizen) to share the file with
    const password = window.prompt('Enter password'); // Get the agency's password
    // Get the receiver's public key and file's data key with fileId, userId (agency) and receiver's userId
    // userId and fileId to get encrypted data key of the file
    const response = await getUserPublicKeyAndFileDatakey(
      fileID,
      userid,
      receiverId!
    );

    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;

    // Get the encrypted private key of the sharer (agency) and decrypt it with the agency's password with scrypt
    const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);
    const plainPrivateKey = await decryptDataWithPasswordWithScrypt(
      password!,
      encryptedPrivateKey,
      saltUint,
      ivUint
    );

    // Import the decrypted private key into CryptoKey and decrypt the encrypted data key with it
    const importedPrivateKey = await importPrivateKey(plainPrivateKey);
    // const fileIVVal = base64StringToArrayBuffer(response.iv) as Uint8Array;
    // const dataKey = await decryptWithSymmetricKey(
    //   importedPrivateKey!,
    //   response.encryptedDataKey,
    //   fileIVVal
    // );
    const dataKey = await decryptWithCryptoKey(
      importedPrivateKey!,
      response.encryptedDataKey
    );

    console.log('data key before encrypt', dataKey);

    // Encrypt the data key with the receiver's public key to share
    // const importedPublicKey = await importSymmtricKey(response.publicKey!);
    const importedPublicKey = await importPublicKey(response.publicKey);
    const receiverEncryptedDataKey = await encryptWithCryptoKey(
      importedPublicKey!,
      dataKey!
    );

    /**
     * Test decrypt on the spot
     */
    const {
      encryptedPrivateKey: userEncryptedPrivateKey,
    } = await getUserEncryptedPrivateKey('user-2');

    const userSaltUint = base64StringToArrayBuffer(
      'K3WRLjFjOpWQWkJXf7eeWA=='
    ) as Uint8Array;
    const userIvUint = base64StringToArrayBuffer(
      '7JHgc6Wa9H2FLQcd'
    ) as Uint8Array;
    const userPrivateKeyString = await decryptDataWithPasswordWithScrypt(
      'user-2pw',
      userEncryptedPrivateKey,
      saltUint,
      ivUint
    );
    console.log('userPrivateKeyString', userPrivateKeyString);

    const importedUserPrivateKey = await importPrivateKey(userPrivateKeyString);
    const dataKeyInBase64 = await decryptWithCryptoKey(
      importedUserPrivateKey!,
      receiverEncryptedDataKey!
    );
    console.log('datakey after decrypt', dataKeyInBase64);

    /**
     * End Test
     */

    // const res = await addEncryptedDataKey({
    //   encryptedDataKey: receiverEncryptedDataKey!,
    //   fileId: fileID,
    //   userId: receiverId!,
    //   iv: response.iv,
    // });

    console.log('finished sharing');
    // console.log(res);
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

    const dataIv = generateIV(); // Generate IV
    const dataKey = (await generateSymKeyPair())!; // Generate data key (symmetric key)
    const dataInText = await file.text(); // Convert the entire file where contents are interpreted as UTF-8 text
    // Encrypt the file with data key and iv
    const encryptedData = (await encryptWithSymmetricKey(
      dataKey,
      dataInText,
      dataIv
    ))!;

    const importedPublicKey = (await importPublicKey(publicKey))!; // Import the public key into CryptoKey
    const exportedDataKey = (await exportSymmtricKey(dataKey))!; // Export the data key to be encrypted into base64
    // Encrypt the data key (base64) withe user's public key
    const encryptedDataKey = (await encryptWithCryptoKey(
      importedPublicKey,
      exportedDataKey
    )) as string;
    console.log('userPublicKeyString', publicKey);
    console.log('data key before encrypt', exportedDataKey);

    /**
     * Test decrypt on the spot
     */
    const {
      encryptedPrivateKey: userEncryptedPrivateKey,
    } = await getUserEncryptedPrivateKey(userid!);

    const userSaltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const userIvUint = base64StringToArrayBuffer(iv) as Uint8Array;
    const userPrivateKeyString = await decryptDataWithPasswordWithScrypt(
      'agency-2pw',
      userEncryptedPrivateKey,
      userSaltUint,
      userIvUint
    );
    console.log('userPrivateKeyString', userPrivateKeyString);

    const importedUserPrivateKey = await importPrivateKey(userPrivateKeyString);
    const dataKeyInBase64 = await decryptWithCryptoKey(
      importedUserPrivateKey!,
      encryptedDataKey!
    );
    console.log('datakey after decrypt', dataKeyInBase64);

    /**
     * End Test
     */

    // Convert the encrypted file (text) back to Blob
    // const encryptedDataBuffer = base64StringToArrayBuffer(encryptedData!);
    // const encryptedDataBlob = new Blob([new Uint8Array(encryptedDataBuffer)]);

    // const formData = new FormData();
    // formData.append('file', new File([encryptedDataBlob], name, { type }));
    // formData.append('userId', userid);
    // formData.append('encryptedDataKey', encryptedDataKey);
    // formData.append('iv', arrayBufferToBase64(dataIv));
    // uploadEncryptedFile(formData);
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
