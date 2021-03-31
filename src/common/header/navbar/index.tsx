import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from 'contants/index';
import { Icon } from 'common/icon';
import {
  MainNavWrapper,
  OpenNavButton,
  CloseNavButton,
  NavItem,
  Nav,
} from 'common/header/navbar/styles';
import Navbar from 'react-bootstrap/Navbar';
import BTSNav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

export const NavBar1 = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <MainNavWrapper>
      <OpenNavButton onClick={() => setOpenDrawer(true)}>
        <Icon icon="bars" />
      </OpenNavButton>
      <Nav open={openDrawer}>
        <CloseNavButton onClick={() => setOpenDrawer(false)}>
          <Icon icon="times" />
        </CloseNavButton>
        {navItems.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <NavItem key={`nav-item-${index}`}>
            <NavLink
              to={item.slug}
              exact
              strict={false}
              activeStyle={{
                fontWeight: 'bold',
                color: 'red',
              }}
            >
              {item.title}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </MainNavWrapper>
  );
};

export const NavBar2 = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <BTSNav className="mr-auto">
          <BTSNav.Link href="#home">Home</BTSNav.Link>
          <BTSNav.Link href="#link">Link</BTSNav.Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </BTSNav>
      </Navbar.Collapse>
    </Navbar>
  );
};
