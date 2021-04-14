import Dashboard from 'pages/dashboard';
import Poc from 'pages/poc';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { WebPage } from './contants';
import { AboutUs } from './pages/about-us';
import { ContactUs } from './pages/contact-us';
import { Home } from './pages/home';
import { Spikes } from './pages/spikes';
import { FileURL } from './pages/file-url';

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={WebPage.HOME} exact>
          <Home />
        </Route>
        <Route path={WebPage.ABOUT} exact>
          <AboutUs />
        </Route>
        <Route path={WebPage.CONTACT} exact>
          <ContactUs />
        </Route>
        <Route path={WebPage.SPKIE} exact>
          <Spikes />
        </Route>
        <Route path={WebPage.POC} exact>
          <Poc />
        </Route>
        <Route path={WebPage.DASHBOARD} exact>
          <Dashboard />
        </Route>
        <Route path={WebPage.FILEURL} exact>
          <FileURL />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
