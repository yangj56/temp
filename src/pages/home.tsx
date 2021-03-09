import BaseLayout from '../app/layout/base-layout';
import { useAppDispatch, useAppSelector } from '../hooks/useSlice';
import { decrement, increment, selectCount } from '../slice/counter';

export function Home(): JSX.Element {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
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
      <span>{count}</span>
      <button
        type="button"
        aria-label="Decrement value"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
      {selectCount}
    </BaseLayout>
  );
}
