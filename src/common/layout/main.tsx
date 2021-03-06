import { LayoutDiv } from 'common/style';
import { AnnouncementBar } from 'components/annoucement-bar';
import { Footer } from 'components/footer';
import { PrimaryHeader } from 'components/header/primary';
import AppStateList from 'features/poc/components/appstate-list';
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
      {showHeader && <PrimaryHeader icon={iconComponent} />}
      {children}
      <Footer />
      <AppStateList />
    </LayoutDiv>
  );
}
