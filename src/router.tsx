import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { WebPage } from './contants';
import { AboutUs } from './pages/about-us';
import { ContactUs } from './pages/contact-us';
import { Home } from './pages/home';

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={WebPage.ABOUT}>
          <AboutUs />
        </Route>
        <Route path={WebPage.CONTACT}>
          <ContactUs />
        </Route>
        <Route path={WebPage.HOME}>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
