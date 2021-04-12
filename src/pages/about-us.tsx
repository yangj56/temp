import { MainLayout } from 'common/layout/main';
import { CustomizedCarousel } from 'components/carousel';
import { carouseItemsData } from 'dummy';
import { increment } from 'features/counter/slices/counter';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'store/store';

export function AboutUs(): JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <MainLayout>
      <h3 className="text-xl">About us</h3>
      <Button variant="primary" onClick={() => dispatch(increment())}>
        Add
      </Button>
      <CustomizedCarousel carouselItems={carouseItemsData} />
    </MainLayout>
  );
}
