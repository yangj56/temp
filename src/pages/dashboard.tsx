/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-console */
/* eslint-disable no-alert */
import { Secondary } from 'common/layout/secondary';
import { LoadingSpinner } from 'components/modal/loading';
import { Eservice, AppState, QueryKey, Role } from 'contants';
import {
  addEncryptedDataKey,
  getAllFiles,
  getAllFilesByUserEservice,
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
  insertAppState,
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
import { Button } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import {
  arrayBufferToBase64,
  base64StringToArrayBuffer,
  formatBytes,
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

interface IGlobalModalMsg {
  title: string;
  text: string;
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
  const [inputModalPassword, setInputModalPassword] = useState('');
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [encryptedPrivateKey, setEncryptedPrivateKey] = useState('');
  const [globalModalMsg, setGlobalModalMsg] = useState<IGlobalModalMsg | null>(
    null
  );
  const [shareesArr, setShareesArr] = useState<any[]>([]);

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [error, setError] = useState('');

  const role = useAppSelector(selectRole) as Role;
  const userid = useAppSelector(selectUserID);
  const iv = useAppSelector(selectIV);
  const salt = useAppSelector(selectSalt);
  const publicKey = useAppSelector(selectPublicKey);

  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const eservice =
    searchParams.get('eservice') === Eservice.BIRTH_REG
      ? Eservice.BIRTH_REG
      : Eservice.DEATH_CERT;

  const dispatchAppState = (appState: string) => {
    dispatch(insertAppState(appState));
  };

  // const { isLoading, isError, data, refetch: fetchAllFiles } = useQuery<
  //   IFileResponse[]
  // >(QueryKey.ALL_FILE, () => getAllFiles(), {
  //   enabled: false,
  // });

  const { isLoading, isError, data, refetch: fetchAllFiles } = useQuery<
    IFileResponse[]
  >(
    [QueryKey.ALL_FILE, userid, eservice],
    () => getAllFilesByUserEservice(userid, eservice!),
    {
      enabled: false,
    }
  );

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
    dispatchAppState(AppState.ACTION_RETRIEVAL_USER_DATA);
    const searchParam = new URLSearchParams(window.location.search);
    const userId = searchParam.get('userid')!;
    const user = await getUserEncryptedPrivateKey(userId);
    dispatchAppState(AppState.RETRIEVE_USER_DATA);
    if (user) {
      dispatch(setSalt(user.salt));
      dispatch(setIV(user.iv));
      dispatch(setUserID(user.id));
      dispatch(setPublicKey(user.publicKey));
      dispatch(setRole(user.role));
      setEncryptedPrivateKey(user.encryptedPrivateKey);
    }
  };

  const handleShareFileToUser = async (fileId: string, userId: string) => {
    let password: string | null = null;
    if (!userPassword) {
      password = window.prompt("Enter agency's password"); // Get the agency's password
      if (typeof password === 'object') return;
    } else {
      password = userPassword;
    }

    setLoadingShare(true);

    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;
    // Get the encrypted private key of the sharer (agency) and decrypt it with the agency's password with scrypt
    // const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);

    let plainPrivateKey: string = '';
    try {
      plainPrivateKey = await decryptDataWithPasswordWithScrypt(
        password!,
        encryptedPrivateKey,
        saltUint,
        ivUint
      );
      dispatchAppState(AppState.DECRYPT_PRIVATE_KEY_PASSWORD);
    } catch (err) {
      setLoadingShare(false);
      setError(
        'Failed to share file. Make sure you entered the correct password.'
      );
      return;
    }

    if (!userPassword) setUserPassword(password);

    // Get the receiver's public key and file's data key with fileId, userId (agency) and receiver's userId
    // userId and fileId to get encrypted data key of the file
    const response = await getUserPublicKeyAndFileDatakey(
      fileId,
      userid,
      userId
    );

    dispatchAppState(AppState.RETRIEVE_SHAREE_PUBLIC_KEY);
    dispatchAppState(AppState.RETRIEVE_ENCRYPTED_DATA_KEY);
    // Import the decrypted private key into CryptoKey and decrypt the encrypted data key with it
    const importedPrivateKey = await importPrivateKey(plainPrivateKey);
    const dataKey = await decryptWithCryptoKey(
      importedPrivateKey!,
      response.encryptedDataKey
    );

    dispatchAppState(AppState.DECRYPT_DATA_KEY);
    console.log('data key before encrypt', dataKey);

    // Encrypt the data key with the receiver's public key to share
    // const importedPublicKey = await importSymmtricKey(response.publicKey!);
    const importedPublicKey = await importPublicKey(response.publicKey);
    const receiverEncryptedDataKey = await encryptWithCryptoKey(
      importedPublicKey!,
      dataKey!
    );

    dispatchAppState(AppState.ENCRYPT_DATA_KEY_WITH_USER_PUB_KEY);
    const res = await addEncryptedDataKey({
      encryptedDataKey: receiverEncryptedDataKey!,
      fileId,
      userId,
      iv: response.iv,
    });

    dispatchAppState(AppState.UPLOADING_ENCRYPTED_DATA_KEY);
    setLoadingShare(false);
    console.log('finished sharing');
    console.log(res);
  };

  const handleShareFileToPublicUser = async () => {
    let password: string = '';
    password = !userPassword ? inputModalPassword : userPassword;

    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;

    // Get the encrypted private key of the sharer (agency) and decrypt it with the agency's password with scrypt
    // const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);

    let plainPrivateKey: string = '';
    try {
      plainPrivateKey = await decryptDataWithPasswordWithScrypt(
        password,
        encryptedPrivateKey,
        saltUint,
        ivUint
      );
      dispatchAppState(AppState.DECRYPT_PRIVATE_KEY_PASSWORD);
    } catch (err) {
      setIsGlobalLoading(false);
      setError(
        'Failed to share file. Make sure you entered the correct password.'
      );
      return;
    }

    if (!userPassword) setUserPassword(password);

    // Get the encrypted data key of the file
    const response = await getUserPublicKeyAndFileDatakey(
      fileShare.fileId,
      userid
    );

    dispatchAppState(AppState.RETRIEVE_ENCRYPTED_DATA_KEY);
    // Import the decrypted private key into CryptoKey and decrypt the encrypted data key with it
    const importedPrivateKey = await importPrivateKey(plainPrivateKey);
    const dataKey = await decryptWithCryptoKey(
      importedPrivateKey!,
      response.encryptedDataKey
    );
    dispatchAppState(AppState.DECRYPT_DATA_KEY);
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
    dispatchAppState(AppState.ENCRYPT_DATA_KEY_WITH_PIN);
    dispatchAppState(AppState.UPLOADING_ENCRYPTED_DATA_KEY);
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
        dispatchAppState(AppState.ACTION_SHARE_ONBOARDED_USER);
        handleShareFileToUser(fileId, userId);
      } else {
        dispatchAppState(AppState.ACTION_SHARE_NON_ONBOARDED_USER);
        console.log('no user found');
        setShowShareUserModal(true);
      }
    });
  };

  useEffect(() => {
    if (userid) {
      dispatchAppState(AppState.ACTION_RETRIEVAL_FILE);
      fetchAllFiles();
      dispatchAppState(AppState.RETRIEVE_ALL_FILE);
    } else {
      refetchUser();
    }
  }, [userid]);

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
    dispatchAppState(AppState.ACTION_DOWNLOAD);
    if (!validateInput()) {
      window.alert(`Missing data`);
      return;
    }

    const { id: fileID, name: filename, type: filetype } = item;
    console.log('Start download');

    let password: string | null = null;
    if (!userPassword) {
      password = window.prompt('Enter your password'); // Get the agency's password
      if (typeof password === 'object') return;
    } else {
      password = userPassword;
    }

    setLoadingShare(true);

    // 1. Get user's encrypted private key
    // const { encryptedPrivateKey } = await getUserEncryptedPrivateKey(userid!);

    // console.log('encryptedPrivateKey');
    // console.log(encryptedPrivateKey);

    let privateKeyString: string = '';

    // 2. Enter password to generate password key with scrypt and decrypt the private key with password key
    console.log({ encryptedPrivateKey, salt, iv });
    const saltUint = base64StringToArrayBuffer(salt) as Uint8Array;
    const ivUint = base64StringToArrayBuffer(iv) as Uint8Array;

    try {
      privateKeyString = await decryptDataWithPasswordWithScrypt(
        password!,
        encryptedPrivateKey,
        saltUint,
        ivUint
      );
      dispatchAppState(AppState.DECRYPT_PRIVATE_KEY_PASSWORD);
    } catch (err) {
      setLoadingShare(false);
      setError(
        'Failed to download file. Make sure you entered the correct password.'
      );
      return;
    }

    if (!userPassword) setUserPassword(password);

    // 3. Import the base64 private key into a CryptoKey
    const importedPrivateKey = await importPrivateKey(privateKeyString);

    // 4. Get encrypted file
    const responseData = await getEncryptedFile(fileID);
    dispatchAppState(AppState.RETRIEVE_ENCRYPTED_FILE);
    // 5. Get encrypted data key and iv with userId and fileId
    const { key: encryptedDataKey, iv: fileIV } = (
      await getEncryptedDataKey(fileID, userid)
    )[0];
    dispatchAppState(AppState.RETRIEVE_ENCRYPTED_DATA_KEY);
    const fileIvVal = base64StringToArrayBuffer(fileIV) as Uint8Array;

    // 6. Decrypt the encrypted data key with the imported private key
    const dataKeyInBase64 = await decryptWithCryptoKey(
      importedPrivateKey!,
      encryptedDataKey
    );

    dispatchAppState(AppState.DECRYPT_DATA_KEY);
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

    dispatchAppState(AppState.DECRYPT_FILE_WITH_DATA_KEY);

    // 10. Convert the file string back to Blob
    const dataFile = new File([decryptedFile!], filename, {
      type: filetype,
    });

    setLoadingShare(false);

    console.log('datafile', dataFile);
    const url = window.URL.createObjectURL(dataFile);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    dispatchAppState(AppState.PREPARE_FILE_FOR_DOWNLOAD);
    link.click();
  };

  const handleShareAction = async (fileId: string) => {
    dispatchAppState(AppState.ACTION_SHARE_FILE);
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
    dispatchAppState(AppState.ACTION_UPLOAD);
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
    dispatchAppState(AppState.GENERATE_DATA_KEY);
    const dataInBuffer = await file.arrayBuffer(); // Convert the entire file into array buffer
    // Encrypt the file with data key and iv
    const encryptedData = (await encryptWithSymmetricKey(
      dataKey,
      dataInBuffer,
      dataIv
    ))!;
    dispatchAppState(AppState.ENCRYPT_FILE_WITH_DATA_KEY);
    console.log('old dataInText', dataInBuffer);

    const importedPublicKey = (await importPublicKey(publicKey))!; // Import the public key into CryptoKey
    const exportedDataKey = (await exportSymmtricKey(dataKey))!; // Export the data key to be encrypted into base64
    // Encrypt the data key (base64) withe user's public key
    const encryptedDataKey = (await encryptWithCryptoKey(
      importedPublicKey,
      exportedDataKey
    )) as string;
    dispatchAppState(AppState.ENCRYPT_DATA_KEY_AGENCY_PUB_KEY);
    console.log('userPublicKeyString', publicKey);
    console.log('data key before encrypt', exportedDataKey);

    // Convert the encrypted file back to Blob
    const encryptedDataBuffer = base64StringToArrayBuffer(encryptedData!);
    const encryptedDataBlob = new Blob([new Uint8Array(encryptedDataBuffer)]);
    const encryptedFile = new File([encryptedDataBlob], name, { type });

    const formData = new FormData();
    formData.append('file', encryptedFile);
    formData.append('userId', userid);
    formData.append('eservice', eservice!);
    formData.append('encryptedDataKey', encryptedDataKey);
    formData.append('iv', arrayBufferToBase64(dataIv));
    const uploadResult = await uploadEncryptedFile(formData);
    dispatchAppState(AppState.UPLOADING_ENCRYPTED_FILE);
    dispatchAppState(AppState.UPLOADING_ENCRYPTED_DATA_KEY);
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

  const handleGetSharees = async (userId: string, fileId: string) => {
    const sharees = await getSharees(userId, fileId);
    if (sharees.length === 0)
      setGlobalModalMsg({ title: 'Message', text: 'No sharee' });
    setShareesArr(sharees);
  };

  const handleRevoke = async (revokeUserid: string, fileid: string) => {
    const result = await revokeSharee(revokeUserid, fileid);
    if (result.deleted) {
      setGlobalModalMsg({
        title: 'Message',
        text: `Sharing of file with id ${fileid} to user with id ${revokeUserid} has been revoked`,
      });
    } else {
      setGlobalModalMsg({
        title: 'Message',
        text: `Failed to revoke sharing of file with id ${fileid} to user with id ${revokeUserid}`,
      });
    }

    return result;
  };

  const fileComponents = data
    ? data.map((item, index) => (
        <FileCard
          name={`${item.name}`}
          size={`${formatBytes(item.size)}`}
          thumbnailPath={item.thumbnailPath}
          onDownload={() => handleDownloadAction(item)}
          onShare={() => handleShareAction(item.id)}
          role={role}
          key={`dashboard-card-${index}`}
          onGetSharees={() => handleGetSharees(userid, item.id)}
        />
      ))
    : null;

  return (
    <Secondary>
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
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 m-4">
        {fileComponents}
      </div>
      <AppStateList />
      {showShareUserModal && (
        <InputModal
          show={showShareUserModal}
          hidePassword={!!userPassword}
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
          onPasswordChange={(e) => setInputModalPassword(e.target.value)}
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
      {globalModalMsg && (
        <TextModal
          show
          title={globalModalMsg.title}
          onClose={() => setGlobalModalMsg(null)}
        >
          <p>{globalModalMsg.text}</p>
        </TextModal>
      )}
      {error && (
        <TextModal show title="Error" onClose={() => setError('')}>
          <p>{error}</p>
        </TextModal>
      )}
      {shareesArr.length > 0 && (
        <TextModal
          show={shareesArr.length > 0}
          title="Show Sharees"
          onClose={() => setShareesArr([])}
        >
          {shareesArr.map(({ id: shareUserId, fileId: shareFileId }, index) => (
            <div
              className="flex items-center justify-between mb-5"
              key={`sharee-${index}`}
            >
              <p className="mr-5">{`${shareUserId}`}</p>
              <Button
                variant="primary"
                onClick={() => {
                  handleRevoke(shareUserId, shareFileId);
                  setShareesArr([]);
                }}
              >
                Revoke Access
              </Button>
            </div>
          ))}
        </TextModal>
      )}
      {(isGlobalLoading || loadingUpload || loadingShare) && (
        <LoadingSpinner loading />
      )}
    </Secondary>
  );
}
