import { useDispatch } from 'react-redux';
import { MainLayout } from 'common/layout/main';
import { useAppSelector } from 'hooks/useSlice';
import {
  decrement,
  increment,
  selectCount,
} from 'features/counter/slices/counter';
import { AppDispatch } from 'store/store';
import Button from 'react-bootstrap/esm/Button';

export function ContactUs(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();

  const counter = useAppSelector(selectCount);
  return (
    <MainLayout showHeader={false}>
      <h3 className="text-xl">Contact us</h3>
      <Button variant="primary" onClick={() => dispatch(increment())}>
        Add
      </Button>{' '}
      <Button variant="primary" onClick={() => dispatch(decrement())}>
        Minus
      </Button>
      <p>{counter}</p>
    </MainLayout>
  );
}
