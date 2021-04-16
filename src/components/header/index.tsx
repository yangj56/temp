import { navItems } from 'contants';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

type Props = {
  headerTitle?: string;
  icon?: JSX.Element;
};

export const Header = ({ headerTitle, icon }: Props) => {
  const navComponents = navItems.map(
    ({ dropdownItems, title, id = '', slug }, index) => {
      if (dropdownItems && dropdownItems.length > 0) {
        const subNavComponents = dropdownItems.map(
          ({ dropdownSlug, dropdownTitle }, dropdownIndex) => (
            <NavDropdown.Item
              as={NavLink}
              to={dropdownSlug || '/'}
              key={`dropdownitems-${dropdownIndex}-${id}`}
            >
              {dropdownTitle}
            </NavDropdown.Item>
          )
        );
        return (
          <NavDropdown title={title} id={id} key={`dropdown-${index}-${id}`}>
            {subNavComponents}
          </NavDropdown>
        );
      }
      return (
        <Nav.Link
          as={NavLink}
          to={slug || '/'}
          id={id}
          key={`navitems-${index}-${id}`}
          exact
        >
          {title}
        </Nav.Link>
      );
    }
  );

  return (
    <Navbar expand="lg" className="bg-gray-300 flex justify-between px-5">
      <div>
        {(icon || headerTitle) && (
          <Navbar.Brand href="#home">{icon || headerTitle}</Navbar.Brand>
        )}
      </div>
      <div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="items-end">{navComponents}</Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};
