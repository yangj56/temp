import { MainLayout } from 'common/layout/main';
import { CustomizedCarousel } from 'components/carousel';
import { carouseItemsData } from 'dummy';

export function AboutUs(): JSX.Element {
  return (
    <MainLayout>
      <h3 className="text-xl">About us</h3>
      <CustomizedCarousel carouselItems={carouseItemsData} />
    </MainLayout>
  );
}
