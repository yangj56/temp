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
  uploadToS3,
} from 'features/poc/apis/poc';
import {
  selectIV,
  selectRole,
  selectSalt,
  selectUserID,
  selectPublicKey,
  setSalt,
  setIV,
  setUserID,
  setPublicKey,
  setRole,
} from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { useState, useRef, useEffect } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
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

import { LoadingSpinner } from 'components/modal/loading';
import AppStateList from 'features/poc/components/appstate-list';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';

export interface IFile {
  id: string;
  title: string;
  image: string;
}

export default function Dashboard() {
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [loadingUpload, setLoadingUpload] = useState(false);

  const role = useAppSelector(selectRole);
  const userid = useAppSelector(selectUserID);
  const iv = useAppSelector(selectIV);
  const salt = useAppSelector(selectSalt);
  const publicKey = useAppSelector(selectPublicKey);

  const { isLoading, isError, data, refetch: fetchAllFiles } = useQuery<
    IFileResponse[]
  >(QueryKey.ALL_FILE, () => getAllFiles(), {
    enabled: false,
  });

  const refetchUser = async () => {
    const searchParam = new URLSearchParams(window.location.search);
    const userId = searchParam.get('userid')!;
    const user = await getUserEncryptedPrivateKey(userId);
    if (user) {
      dispatch(setSalt(user.salt));
      dispatch(setIV(user.iv));
      dispatch(setUserID(user.id));
      dispatch(setPublicKey(user.publicKey));
      dispatch(setRole(user.role));
    }
  };

  useEffect(() => {
    fetchAllFiles();
    refetchUser();
  }, []);

  if (isLoading) {
    return <LoadingSpinner loading />;
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
    const responseData = await getEncryptedFile(fileID);

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

    // 7. Import the base64 data key into CryptoKey
    const importedDataKey = await importSymmtricKey(dataKeyInBase64!);

    // 8. Convert the file back to text
    const dataInBuffer: ArrayBuffer = await responseData.data.arrayBuffer();

    console.log('dataInBuffer');
    console.log(dataInBuffer);

    // 9. Decrypt the file with the data key and iv
    const decryptedFile = await decryptWithSymmetricKey(
      importedDataKey!,
      dataInBuffer,
      fileIvVal
    );

    // 10. Convert the file string back to Blob
    const dataFile = new File([decryptedFile!], 'lala.pdf', {
      type: 'application/pdf',
    });

    console.log('datafile', dataFile);
    const url = window.URL.createObjectURL(dataFile);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'loli.pdf');
    document.body.appendChild(link);
    link.click();
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

    const res = await addEncryptedDataKey({
      encryptedDataKey: receiverEncryptedDataKey!,
      fileId: fileID,
      userId: receiverId!,
      iv: response.iv,
    });

    console.log('finished sharing');
    console.log(res);
  };

  const handleUploadAction = () => {
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }

    if (hiddenFileInputRef.current !== null) {
      hiddenFileInputRef.current.click();
    }
  };

  const handleUploadedFile = async (file: File) => {
    setLoadingUpload(true);
    console.log('Start uploading');
    const { name, type } = file;

    const dataIv = generateIV(); // Generate IV
    const dataKey = (await generateSymKeyPair())!; // Generate data key (symmetric key)
    const dataInBuffer = await file.arrayBuffer(); // Convert the entire file where contents are interpreted as UTF-8 text
    // Encrypt the file with data key and iv
    const encryptedData = (await encryptWithSymmetricKey(
      dataKey,
      dataInBuffer,
      dataIv
    ))!;
    console.log('old dataInText', dataInBuffer);

    const importedPublicKey = (await importPublicKey(publicKey))!; // Import the public key into CryptoKey
    const exportedDataKey = (await exportSymmtricKey(dataKey))!; // Export the data key to be encrypted into base64
    // Encrypt the data key (base64) withe user's public key
    const encryptedDataKey = (await encryptWithCryptoKey(
      importedPublicKey,
      exportedDataKey
    )) as string;
    console.log('userPublicKeyString', publicKey);
    console.log('data key before encrypt', exportedDataKey);

    // Convert the encrypted file (text) back to Blob
    const encryptedDataBuffer = base64StringToArrayBuffer(encryptedData!);
    const encryptedDataBlob = new Blob([new Uint8Array(encryptedDataBuffer)]);
    const encryptedFile = new File([encryptedDataBlob], name, { type });

    // const formData = new FormData();
    // formData.append('file', new File([encryptedDataBlob], name, { type }));
    // formData.append('userId', userid);
    // formData.append('encryptedDataKey', encryptedDataKey);
    // formData.append('iv', arrayBufferToBase64(dataIv));
    // const uploadResult = await uploadEncryptedFile(formData);
    // if (uploadResult) {
    //   fetchAllFiles();
    // }
    uploadToS3(encryptedFile);
    setLoadingUpload(false);
  };

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    handleUploadedFile(e.target.files[0]);
    e.target.value = '';
  };

  const fileComponents = data
    ? data.map((item, index) => (
        <Card
          style={{ width: '18rem', marginTop: 10, marginBottom: 10 }}
          key={`dashboard-card-${index}`}
        >
          <Card.Img
            variant="top"
            src={
              item.thumbnailPath ||
              'https://dummyimage.com/335x333/4ff978/c009e2.png'
            }
            style={{ height: '15rem' }}
          />
          <Card.Body>
            <Card.Text>{item.name}</Card.Text>
            <div className="flex flex-row justify-between">
              <Button
                variant="primary"
                onClick={() => handleDownloadAction(item.id)}
              >
                download
              </Button>
              {role === Role.AGENCY ? (
                <Button
                  variant="primary"
                  onClick={() => handleShareAction(item.id)}
                >
                  share
                </Button>
              ) : null}
            </div>
          </Card.Body>
        </Card>
      ))
    : null;

  return (
    <MainLayout>
      {loadingUpload && (
        <div className="flex flex-row items-center mt-2 p-2">
          <h3 className="mx-2">Uploading</h3>
          <Spinner animation="border" />
        </div>
      )}
      {isError && <div>isError</div>}
      {role === Role.AGENCY ? (
        <div className="ml-4 mt-2">
          {!loadingUpload && (
            <Button
              variant="primary"
              className="mt-2"
              onClick={handleUploadAction}
            >
              Upload Document
            </Button>
          )}
          <input
            type="file"
            ref={hiddenFileInputRef}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            multiple={false}
            onChange={handleFileOnChange}
          />
        </div>
      ) : null}
      <div className="flex flex-row flex-wrap justify-between px-4 py-2">
        {fileComponents}
      </div>
      <AppStateList />
    </MainLayout>
  );
}
