import { MainLayout } from 'common/layout/main';
import { UserList } from 'features/user/components';
import { SingleBanner } from 'components/banner/single';
import { MultipleBanner } from 'components/banner/multiple';
import { CardProp } from 'typing';

export function Home() {
  const singleBannerData: CardProp = {
    title: 'title 1',
    description: 'description',
    image: 'https://dummyimage.com/600x400/000/fff',
    imageAlt: 'imagetext',
    subText: 'this is sub text',
  };

  return (
    <MainLayout>
      <h3 className="text-xl">Home</h3>
      {/* <UserList /> */}
      <SingleBanner card={singleBannerData} />
      <MultipleBanner
        cards={[singleBannerData, singleBannerData, singleBannerData]}
      />
    </MainLayout>
  );
}
