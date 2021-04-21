import axios from 'axios';
import { apiServerCLient } from 'config/api-client';
import { Eservice } from 'contants';
import { String } from 'lodash';

export interface ILoginInput {
  id: string;
  salt: string;
  iv: string;
  publicKey: string;
  encryptedPrivateKey: string;
  role: string;
}

export interface ILoginResponse {
  id: string;
  iv: string;
  salt: string;
  role: string;
  encryptedPrivateKey: string;
  publicKey: string;
}

export interface IAddKeyInput {
  userId: string;
  fileId: string;
  encryptedDataKey: string;
  iv: string;
}

export interface IAddKeyResponse {
  key: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}

// API-1
export const addEncryptedDataKey = async (
  input: IAddKeyInput
): Promise<IAddKeyResponse> => {
  return apiServerCLient.post('/user/add-key', input).then((response) => {
    return response.data.data;
  });
};

export interface IUploadFileInput {
  userId: string;
  file: File;
  encryptedDataKey: string;
}

export interface IUploadFileResponse {
  name: string;
  id: number;
}

// API-2
export const uploadEncryptedFile = async (
  input: FormData
): Promise<IUploadFileResponse> => {
  return apiServerCLient
    .post('/user/file', input, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    })
    .then((response) => {
      return response.data.data;
    });
};

export interface IFileResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  type: string;
  size: number;
  thumbnailPath: string;
}

// API-3
export const getAllFiles = async (): Promise<IFileResponse[]> => {
  return apiServerCLient.get('/file/all').then((response) => {
    console.log('---------');
    console.log(response.data.data);
    return response.data.data;
  });
};

export interface IUserResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  salt: string;
  iv: string;
  publicKey: string;
  encryptedPrivateKey: string;
  role: string;
}

// API-4
export const getUserEncryptedPrivateKey = async (
  input: string
): Promise<IUserResponse> => {
  return apiServerCLient.get(`/user/${input}`).then((response) => {
    return response.data.data;
  });
};

export interface IDownloadFile {
  fileid: string;
  userid: string;
  signedFileName: string;
}

// API-5
export const getEncryptedFile = async (fileId: string): Promise<any> => {
  return apiServerCLient
    .get(`/file/${fileId}`, {
      responseType: 'blob',
    })
    .then((response) => {
      return response;
    });
};

interface IUserPublicKeyAndFileDatakeyResponse {
  encryptedDataKey: string;
  publicKey: string;
  iv: string;
}
// API-6 (is recevierId is not given, return only the encrypted data key of the file)
export const getUserPublicKeyAndFileDatakey = async (
  fileId: string,
  userId: string,
  receiverId = ''
): Promise<IUserPublicKeyAndFileDatakeyResponse> => {
  return apiServerCLient
    .get(
      `/user/share-file?fileId=${fileId}&sharerId=${userId}&receiverId=${receiverId}`
    )
    .then((response) => {
      return response.data.data;
    });
};

// API-7
export const postLoginUser = async (
  input: ILoginInput
): Promise<ILoginResponse> => {
  return apiServerCLient.post('/user', input).then((response) => {
    return response.data.data;
  });
};

interface IEncryptedDataKeyResponse {
  id: string;
  key: string;
  iv: string;
}

// API-8
export const getEncryptedDataKey = async (
  fileId: string,
  userId = ''
): Promise<IEncryptedDataKeyResponse> => {
  return apiServerCLient
    .get(`/user/key?fileId=${fileId}&userId=${userId}`)
    .then((response) => {
      return response.data.data;
    });
};

// API-9
export const getExistingUser = async (
  userid: string
): Promise<IUserResponse | null> => {
  return apiServerCLient.get(`/user/check-user/${userid}`).then((response) => {
    return response.data.data;
  });
};

export const getFileUploadPresignedUrl = async (
  filename: string
): Promise<string> => {
  return apiServerCLient
    .get(`/file/upload-url/${filename}`)
    .then((response) => {
      return response.data.data;
    });
};

interface IShareFileToPublicUserInput {
  userId: string;
  fileId: number;
  encryptedDataKey: string;
  dataIv: string;
  salt: string;
  iv: string;
  pin: string;
}

interface IShareFileToPublicUserResponse {
  id: string;
  salt: string;
  iv: string;
  fileShareLoginURL: string;
  pin: string;
  user: { id: string };
  createdAt: string;
  updatedAt: string;
}

export const postShareFileToPublicUser = async (
  input: IShareFileToPublicUserInput
): Promise<IShareFileToPublicUserResponse | null> => {
  return apiServerCLient
    .post('/user/share-file-public', input)
    .then((response) => response.data.data);
};

interface ITransactionResponse {
  id: string;
  salt: string;
  iv: string;
  transactionFiles: ITransactionFile[];
}

export interface ITransactionFile {
  id: string;
  tempDataKey: string;
  tempDataIv: string;
  file: IFile;
}

export interface IFile {
  id: string;
  name: string;
  type: string;
  path: string;
  awsKey: string;
  thumbnailPath: string;
}

export const getTransaction = async (
  transactionId: string
): Promise<ITransactionResponse | null> => {
  return apiServerCLient
    .get(`/transaction/${transactionId}`)
    .then((response) => response.data.data);
};

export const uploadToS3 = async (file: File) => {
  const { name, type } = file;
  const presignedUploadUrl = await getFileUploadPresignedUrl(name);
  console.log('type', type);
  console.log('presigned', presignedUploadUrl);

  // const formData = new FormData();
  // formData.append('file', file);

  // Upload the image to our pre-signed URL.
  return axios
    .put(presignedUploadUrl, file, {
      headers: {
        'content-type': type,
      },
    })
    .then((response) => console.log('uploaded succesfullyy', response))
    .catch((err) => console.log('err', err));

  // const response = await fetch(
  //   new Request(presignedUploadUrl, {
  //     method: 'PUT',
  //     body: file,
  //     headers: new Headers({
  //       'Content-Type': type,
  //     }),
  //   })
  // );

  // console.log('res', response);
};

export const getSharees = async (userid: string, fileid: string) => {
  return apiServerCLient
    .get(`/user/all-shared?userId=${userid}&fileId=${fileid}`)
    .then((response) => response.data.data);
};

export const revokeSharee = async (userid: string, fileid: string) => {
  return apiServerCLient
    .delete(`/key?userId=${userid}&&fileId=${fileid}`)
    .then((response) => response.data.data);
};

export const getAllFilesByUserEservice = (
  userid: string,
  eservice: Eservice
) => {
  return apiServerCLient
    .get(`/file/all-belong?userId=${userid}&eservice=${eservice}`)
    .then((response) => response.data.data);
};
