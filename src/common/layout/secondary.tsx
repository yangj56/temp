import { LayoutDiv } from 'common/style';
import { Footer } from 'components/footer';
import { SecondaryHeader } from 'components/header/secondary';
import { Role } from 'contants';
import AppStateList from 'features/poc/components/appstate-list';
import { PropsWithChildren } from 'react';
import { FaFileAlt } from 'react-icons/fa';

type Props = {
  showHeader?: boolean;
};

export function Secondary({
  children,
  showHeader = true,
}: PropsWithChildren<Props>) {
  const iconComponent = <FaFileAlt />;
  return (
    <LayoutDiv>
      {showHeader && <SecondaryHeader icon={iconComponent} />}
      {children}
      <Footer />
      <AppStateList />
    </LayoutDiv>
  );
}
