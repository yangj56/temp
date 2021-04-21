import { Role } from 'contants';
import { selectEservice, selectRole } from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { Button, Card, Nav, Navbar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import ICALogo from 'assets/ica_mobile_logo.svg';
import lifesg from 'assets/lifesg.png';

type Props = {
  headerTitle?: string;
  icon?: JSX.Element;
};

export const SecondaryHeader = ({ headerTitle, icon }: Props) => {
  const routerHistory = useHistory();
  const userRole = useAppSelector(selectRole);
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const eservice = searchParams.get('eservice');
  const userId = searchParams.get('userid');
  // const eservice = useAppSelector(selectEservice);

  return (
    <Navbar
      expand="lg"
      className="flex justify-between"
      style={{
        backgroundColor: userRole === Role.AGENCY ? '#FCA5A5' : '#93C5FD',
      }}
    >
      <div className="flex flex-grow items-center">
        {(icon || headerTitle) && (
          <Navbar.Brand href="/">{icon || headerTitle}</Navbar.Brand>
        )}
        {userRole === Role.AGENCY && (
          <Card.Img style={{ height: 50, width: 50 }} src={ICALogo} />
        )}
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: '15px',
          }}
        >
          <div>{eservice && <strong>{`Eservice : ${eservice}`}</strong>}</div>
          <div style={{ marginRight: '20px' }}>
            {userId && <strong>{`${userId}`}</strong>}
          </div>
        </div>
      </div>

      <div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="items-end">
            <Button
              variant="primary"
              onClick={() => {
                if (userRole === Role.AGENCY) {
                  routerHistory.push(`/agency-login`);
                } else {
                  routerHistory.push(`/public-login`);
                }
              }}
            >
              Logout
            </Button>{' '}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};
