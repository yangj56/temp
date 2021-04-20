import Dashboard from 'pages/dashboard';
import { LoginAgency } from 'pages/login-agency';
import { LoginPublic } from 'pages/login-public';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { WebPage } from './contants';
import { AboutUs } from './pages/about-us';
import { ContactUs } from './pages/contact-us';
import { Home } from './pages/home';
import { Spikes } from './pages/spikes';
import { FileURL } from './pages/file-url';
import { EService } from './pages/eservice';
import { LoginFileShare } from './pages/login-file-share';
import { FileShare } from './pages/file-share';

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
        <Route path={WebPage.LOGIN_AGENCY} exact>
          <LoginAgency />
        </Route>
        <Route path={WebPage.LOGIN_PUBLIC} exact>
          <LoginPublic />
        </Route>
        <Route path={WebPage.DASHBOARD} exact>
          <Dashboard />
        </Route>
        <Route path={WebPage.FILEURL} exact>
          <FileURL />
        </Route>
        <Route path={WebPage.ESERVICES} exact>
          <EService />
        </Route>
        <Route path={WebPage.LOGIN_FILE_SHARE} exact>
          <LoginFileShare />
        </Route>
        <Route path={WebPage.FILE_SHARE} exact>
          <FileShare />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
