import { useDispatch } from 'react-redux';
import { BaseLayout } from 'common/layout/base-layout';
import { useAppSelector } from 'hooks/useSlice';
import {
  decrement,
  increment,
  selectCount,
} from 'features/counter/slices/counter';
import { AppDispatch } from 'store/store';
import { UserList } from 'features/user/components';
import { SingleBanner } from 'common/banner/single';
import { TwinBanner } from 'common/banner/twin';

export function Home() {
  const dispatch = useDispatch<AppDispatch>();

  const counter = useAppSelector(selectCount);
  return (
    <BaseLayout>
      <h2>Home</h2>
      <button className="bg-red-500 hover:bg-red-700" type="button">
        Hover me
      </button>
      <button
        type="button"
        aria-label="Increment value"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <button
        type="button"
        aria-label="Decrement value"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
      <p>{counter}</p>
      <UserList />
      <SingleBanner />
      <TwinBanner />
    </BaseLayout>
  );
}
