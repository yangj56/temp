import { apiCLient } from 'config/api-client';

export interface IUserList {
  id: string;
  picture: string;
  firstName: string;
  lastName: string;
  email: string;
  title: string;
}

export const getUserListing = async (): Promise<IUserList[]> => {
  return apiCLient.get('/user?limit=10').then((response) => {
    return response.data.data;
  });
};
