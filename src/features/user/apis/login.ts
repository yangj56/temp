import { apiServerCLient } from 'config/api-client';

export interface ILoginInput {
  id: string;
  salt?: string;
  publicKey?: string;
  encryptedPrivateKey?: string;
  role: string;
}

export interface ILoginResponse {
  username: string;
  password: string;
}

export const postLoginUser = async (
  input: ILoginInput
): Promise<ILoginResponse> => {
  return apiServerCLient.post('/user', input).then((response) => {
    return response.data.data;
  });
};
