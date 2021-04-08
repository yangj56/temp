import { getUserListing, IUserList } from 'features/user/apis/user-listing';
import { Listing } from 'components/skeleton-loader/listing';
import { QueryKey } from 'contants';
import { useQuery } from 'react-query';

export function UserList() {
  const { isLoading, isError, data } = useQuery<IUserList[]>(
    QueryKey.USER_LIST,
    getUserListing,
    {
      cacheTime: 10,
    }
  );

  if (isLoading) {
    return <Listing />;
  }

  if (isError) {
    return <div>isError</div>;
  }

  if (data) {
    const users = data.map((item: IUserList, index: number) => (
      // eslint-disable-next-line react/no-array-index-key
      <div key={`user-item-${index}`}>{item.firstName}</div>
    ));

    return <div>{users}</div>;
  }
  return <div>null</div>;
}
