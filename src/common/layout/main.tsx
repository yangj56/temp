import { LayoutDiv } from 'common/style';
import { AnnouncementBar } from 'components/annoucement-bar';
import { Footer } from 'components/footer';
import { Header } from 'components/header';
import { PropsWithChildren } from 'react';
import { FaFileAlt } from 'react-icons/fa';

type Props = {
  showHeader?: boolean;
};

export function MainLayout({
  children,
  showHeader = true,
}: PropsWithChildren<Props>) {
  const iconComponent = <FaFileAlt />;
  return (
    <LayoutDiv>
      {/* <AnnouncementBar title="This is an annoucement" /> */}
      {showHeader && <Header icon={iconComponent} />}
      {children}
      <Footer />
    </LayoutDiv>
  );
}
