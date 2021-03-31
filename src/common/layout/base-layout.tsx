import { AnnouncementBar } from 'common/annoucement-bar';
import { Footer } from 'common/footer';
import { Header } from 'common/header';
import { PropsWithChildren } from 'react';

type Props = {
  selected?: number;
};

export function BaseLayout({ children }: PropsWithChildren<Props>) {
  return (
    <>
      <AnnouncementBar title="Every utility class in Tailwind can be applied conditionally at different breakpoints, which makes it a piece of cake to build complex responsive interfaces without ever leaving your HTML." />
      <Header title="New site" />
      {children}
      <Footer />
    </>
  );
}
