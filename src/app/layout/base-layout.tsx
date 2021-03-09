import React, { PropsWithChildren } from 'react';
import { Footer } from '../components/footer';
import { NavigationBar } from '../components/navigation-bar';

interface Props {
  selected?: number;
}

export default function BaseLayout({ children }: PropsWithChildren<Props>) {
  return (
    <div>
      <NavigationBar />
      {children}
      <Footer />
    </div>
  );
}
