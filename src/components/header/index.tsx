import {
  Button,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap';
import { navItems } from 'contants';

type Props = {
  headerTitle?: string;
  icon?: JSX.Element;
};

export const Header = ({ headerTitle, icon }: Props) => {
  const navComponents = navItems.map(
    ({ dropdownItems, title, id = '', slug }) => {
      if (dropdownItems && dropdownItems.length > 0) {
        const subNavComponents = dropdownItems.map(
          ({ dropdownSlug, dropdownTitle }) => (
            <NavDropdown.Item href={dropdownSlug}>
              {dropdownTitle}
            </NavDropdown.Item>
          )
        );
        return (
          <NavDropdown title={title} id={id}>
            {subNavComponents}
          </NavDropdown>
        );
      }
      return (
        <Nav.Link href={slug} id={id}>
          {title}
        </Nav.Link>
      );
    }
  );

  return (
    <Navbar bg="light" expand="lg">
      {icon && <Navbar.Brand href="#home">{icon || headerTitle}</Navbar.Brand>}
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">{navComponents}</Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};
