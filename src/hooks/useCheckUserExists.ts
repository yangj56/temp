import { getExistingUser, IUserResponse } from 'features/poc/apis/poc';
import { useQuery, UseQueryResult } from 'react-query';
import { QueryKey } from '../contants';

export const useCheckUserExists = (username: string) => {
  return useQuery<IUserResponse | null>(
    QueryKey.USER_EXIST,
    () => getExistingUser(username),
    {
      cacheTime: 10,
      enabled: false,
    }
  );
};
