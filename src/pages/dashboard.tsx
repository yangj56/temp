/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { Secondary } from 'common/layout/secondary';
import { LoadingSpinner } from 'components/modal/loading';
import { QueryKey, Role } from 'contants';
import {
  addEncryptedDataKey,
  getAllFiles,
  getEncryptedDataKey,
  getEncryptedFile,
  getSharees,
  getUserEncryptedPrivateKey,
  getUserPublicKeyAndFileDatakey,
  IFileResponse,
  postShareFileToPublicUser,
  revokeSharee,
  uploadEncryptedFile,
  uploadToS3,
} from 'features/poc/apis/poc';
import AppStateList from 'features/poc/components/appstate-list';
import {
  selectEservice,
  selectIV,
  selectPublicKey,
  selectRole,
  selectSalt,
  selectUserID,
  setIV,
  setPublicKey,
  setRole,
  setSalt,
  setUserID,
} from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { useEffect, useRef, useState } from 'react';
import { Button, Card, PageItem, Spinner } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import {
  arrayBufferToBase64,
  base64StringToArrayBuffer,
  generateIV,
  generatePin,
  generateSalt,
} from 'util/helper';
import {
  decryptDataWithPasswordWithScrypt,
  encryptDataWithPasswordWithScrypt,
} from 'util/password-data-key';
import {
  decryptWithCryptoKey,
  encryptWithCryptoKey,
  importPrivateKey,
  importPublicKey,
} from 'util/asymmetric-key';
import {
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
  exportSymmtricKey,
  generateSymKeyPair,
  importSymmtricKey,
} from 'util/symmetric-key';

import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';
import { useCheckUserExists } from 'hooks/useCheckUserExists';
import { InputModal } from 'components/input-modal';
import { TextModal } from 'components/text-modal';
import { FileCard } from '../components/file-card';

export interface IFile {
  id: string;
  title: string;
  image: string;
}

export interface IFileShare {
  userId: string;
  fileId: string;
}

export interface IAdHocFileShare {
  nric: string;
  email: string;
  mobile: string;
}

export default function Dashboard() {
  const [fileShare, setFileShare] = useState<IFileShare>({
    userId: '',
    fileId: '',
  });
  const [adHocFileShare, setAdHocFileShare] = useState<IAdHocFileShare>({
    nric: '',
    email: '',
    mobile: '',
  });
  const [showShareUserModal, setShowShareUserModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userPassword, setUserPassword] = useState('');
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [shareesArr, setShareesArr] = useState<any[]>([
    {
      shareUserId: 'test',
      shareFileId: '123',
      shareFileName: 'est',
    },
    {
      shareUserId: 'test',
      shareFileId: '123',
      shareFileName: 'est',
    },
  ]);

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [loadingUpload, setLoadingUpload] = useState(false);

  const role = useAppSelector(selectRole) as Role;
  const userid = useAppSelector(selectUserID);
  const iv = useAppSelector(selectIV);
  const salt = useAppSelector(selectSalt);
  const publicKey = useAppSelector(selectPublicKey);
  const eservice = useAppSelector(selectEservice);

  const { isLoading, isError, data, refetch: fetchAllFiles } = useQuery<
    IFileResponse[]
  >(QueryKey.ALL_FILE, () => getAllFiles(), {
    enabled: false,
  });

  const {
    isLoading: isCheckUserExistsLoading,
    isError: isCheckUserExistsError,
    refetch: checkUserExists,
  } = useCheckUserExists(fileShare.userId);

  const {
    isLoading: isShareFileToPublicUserLoading,
    isError: isShareFileToPublicUserError,
    mutate: shareFileToPublicUser,
    data: shareFileToPublicUserData,
  } = useMutation(postShareFileToPublicUser, {
    onSuccess: (result) => {
      console.log('result', result);
      setShowShareUserModal(false);
      setShowEmailModal(true);
      setIsGlobalLoading(false);
    },
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

  const handleShareFileToUser = async (fileId: string, userId: string) => {
    const password = window.prompt('Enter password'); // Get the agency's password
    // Get the receiver's public key and file's data key with fileId, userId (agency) and receiver's userId
    // userId and fileId to get encrypted data key of the file
    const response = await getUserPublicKeyAndFileDatakey(
      fileId,
      userid,
      userId
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
      fileId,
      userId,
      iv: response.iv,
    });

    console.log('finished sharing');
    console.log(res);
  };

  const handleShareFileToPublicUser = async () => {
    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;

    // Get the encrypted private key of the sharer (agency) and decrypt it with the agency's password with scrypt
    const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);
    const plainPrivateKey = await decryptDataWithPasswordWithScrypt(
      userPassword,
      encryptedPrivateKey,
      saltUint,
      ivUint
    );

    // Get the encrypted data key of the file
    const response = await getUserPublicKeyAndFileDatakey(
      fileShare.fileId,
      userid
    );

    // Import the decrypted private key into CryptoKey and decrypt the encrypted data key with it
    const importedPrivateKey = await importPrivateKey(plainPrivateKey);
    const dataKey = await decryptWithCryptoKey(
      importedPrivateKey!,
      response.encryptedDataKey
    );

    // Generate PIN, salt and iv, generate password key from PIN and encrypt data key with the password key
    const pin = generatePin(6);
    const pinSalt = generateSalt();
    const pinIv = generateIV();

    const encryptedDataKey = await encryptDataWithPasswordWithScrypt(
      pin,
      dataKey,
      pinSalt,
      pinIv
    );

    // TODO: API to create transaction, encrypt data key, which returns url for accessing the file
    shareFileToPublicUser({
      userId: userid,
      fileId: parseInt(fileShare.fileId, 10),
      encryptedDataKey,
      dataIv: response.iv,
      salt: arrayBufferToBase64(pinSalt),
      iv: arrayBufferToBase64(pinIv),
      pin,
    });
  };

  const handleCheckUserExists = async () => {
    await checkUserExists().then((response) => {
      if (response.data) {
        const { userId, fileId } = fileShare;
        handleShareFileToUser(fileId, userId);
      } else {
        console.log('no user found');
        setShowShareUserModal(true);
      }
    });
  };

  useEffect(() => {
    fetchAllFiles();
    refetchUser();
  }, []);

  useEffect(() => {
    if (fileShare.userId) {
      handleCheckUserExists();
    }
  }, [fileShare]);

  if (isLoading) {
    return <LoadingSpinner loading />;
  }

  const validateInput = () => {
    if (!role || !userid || !iv || !salt) {
      return true;
    }
    return true;
  };

  const handleDownloadAction = async (item: IFileResponse) => {
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }

    const { id: fileID, name: filename, type: filetype } = item;
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
    const dataFile = new File([decryptedFile!], filename, {
      type: filetype,
    });

    console.log('datafile', dataFile);
    const url = window.URL.createObjectURL(dataFile);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  };

  const handleShareAction = async (fileId: string) => {
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }
    console.log('Start sharing');
    const userId = window.prompt('Enter the userid you want to share to'); // Get the id of user (citizen) to share the file with
    if (typeof userId === 'string') {
      if (userId.length > 0) {
        setFileShare({ userId, fileId });
      } else {
        window.alert('User id cannot be empty!');
      }
    }
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
    const dataInBuffer = await file.arrayBuffer(); // Convert the entire file into array buffer
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

    // Convert the encrypted file back to Blob
    const encryptedDataBuffer = base64StringToArrayBuffer(encryptedData!);
    const encryptedDataBlob = new Blob([new Uint8Array(encryptedDataBuffer)]);
    const encryptedFile = new File([encryptedDataBlob], name, { type });

    const formData = new FormData();
    formData.append('file', encryptedFile);
    formData.append('userId', userid);
    formData.append('encryptedDataKey', encryptedDataKey);
    formData.append('iv', arrayBufferToBase64(dataIv));
    const uploadResult = await uploadEncryptedFile(formData);
    if (uploadResult) {
      fetchAllFiles();
    }

    // uploadToS3(encryptedFile);
    setLoadingUpload(false);
  };

  const handleFileOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    handleUploadedFile(e.target.files[0]);
    e.target.value = '';
  };

  const handleGetSharees = async () => {
    const sharees = await getSharees(userid);
    setShareesArr(sharees);
  };

  const handleRevoke = async (revokeUserid: string, fileid: string) => {
    return revokeSharee(revokeUserid, fileid);
  };

  const fileComponents = data
    ? data.map((item, index) => (
        <FileCard
          name={item.name}
          thumbnailPath={item.thumbnailPath}
          onDownload={() => handleDownloadAction(item)}
          onShare={() => handleShareAction(item.id)}
          role={role}
          key={`dashboard-card-${index}`}
          onGetSharees={() => handleGetSharees()}
        />
      ))
    : null;

  return (
    <Secondary>
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
      <div className="grid grid-cols-3 gap-4">{fileComponents}</div>
      <AppStateList />
      {showShareUserModal && (
        <InputModal
          show={showShareUserModal}
          title="User is not onboard, please provide information for ad hoc sharing."
          onClose={() => setShowShareUserModal(false)}
          onEnter={() => {
            setIsGlobalLoading(true);
            handleShareFileToPublicUser();
          }}
          onNricChange={(e) =>
            setAdHocFileShare({ ...adHocFileShare, nric: e.target.value })
          }
          onEmailChange={(e) =>
            setAdHocFileShare({ ...adHocFileShare, email: e.target.value })
          }
          onMobileChange={(e) =>
            setAdHocFileShare({ ...adHocFileShare, mobile: e.target.value })
          }
          onPasswordChange={(e) => setUserPassword(e.target.value)}
        />
      )}
      {shareFileToPublicUserData && (
        <TextModal
          show={showEmailModal}
          title="File Retrieval"
          onClose={() => setShowEmailModal(false)}
        >
          <p>
            Please{' '}
            <a href={shareFileToPublicUserData.fileShareLoginURL}>click here</a>{' '}
            to view your shared file. PIN: {shareFileToPublicUserData.pin}
          </p>
        </TextModal>
      )}
      {shareesArr.length > 0 && (
        <TextModal
          show={shareesArr.length > 0}
          title="Show Sharees"
          onClose={() => setShareesArr([])}
        >
          {shareesArr.map(({ shareUserId, shareFileId, shareFileName }) => (
            <div className="flex mb-5">
              <p className="mr-5">{shareFileName}</p>
              <Button
                variant="primary"
                onClick={() => handleRevoke(shareUserId, shareFileId)}
              >
                Revoke Access
              </Button>
            </div>
          ))}
        </TextModal>
      )}
      {isGlobalLoading && <LoadingSpinner loading />}
    </Secondary>
  );
}
