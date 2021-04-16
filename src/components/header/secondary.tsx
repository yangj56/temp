import { Role } from 'contants';
import { selectRole } from 'features/poc/slices/user';
import { useAppSelector } from 'hooks/useSlice';
import { Button, Nav, Navbar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

type Props = {
  headerTitle?: string;
  icon?: JSX.Element;
};

export const SecondaryHeader = ({ headerTitle, icon }: Props) => {
  const routerHistory = useHistory();
  const userRole = useAppSelector(selectRole);
  return (
    <Navbar expand="lg" className="bg-gray-300 flex justify-between px-5">
      <div>
        {(icon || headerTitle) && (
          <Navbar.Brand href="/">{icon || headerTitle}</Navbar.Brand>
        )}
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
