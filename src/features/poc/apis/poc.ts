import { apiServerCLient } from 'config/api-client';

export interface ILoginInput {
  id: string;
  salt: string;
  iv: string;
  publicKey: string;
  encryptedPrivateKey: string;
  role: string;
}

export interface ILoginResponse {
  username: string;
  password: string;
}

export interface IAddKeyInput {
  userId: string;
  fileId: string;
  encryptedDataKey: string;
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
  file: string;
  encryptedDataKey: string;
}

export interface IUploadFileResponse {
  name: string;
  id: number;
}

// API-2
export const uploadEncryptedFile = async (
  input: IUploadFileInput
): Promise<IUploadFileResponse> => {
  return apiServerCLient.post('/user/file', input).then((response) => {
    return response.data.data;
  });
};

export interface IFileResponse {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
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
export const getEncryptedFile = async (
  input: IDownloadFile
): Promise<string> => {
  return apiServerCLient.post(`/file`, input).then((response) => {
    return response.data.data;
  });
};

// API-6
export const getUserPublicKeyAndFileDatekey = async (
  input: ILoginInput
): Promise<ILoginResponse> => {
  return apiServerCLient.post('/da', input).then((response) => {
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
