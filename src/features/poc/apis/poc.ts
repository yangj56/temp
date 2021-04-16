import axios from 'axios';
import { apiServerCLient } from 'config/api-client';
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
// API-6
export const getUserPublicKeyAndFileDatakey = async (
  fileId: string,
  userId: string,
  receiverId: string
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

export const uploadToS3 = async (file: File) => {
  const { name, type } = file;
  const presignedUploadUrl = await getFileUploadPresignedUrl(name);
  console.log('type', type);
  console.log('presigned', presignedUploadUrl);

  // const formData = new FormData();
  // formData.append('file', file);

  // Upload the image to our pre-signed URL.
  return axios
    .post(presignedUploadUrl, file, {
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
