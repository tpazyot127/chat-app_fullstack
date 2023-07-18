import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useTypedSelector, useUserActions } from "../../hooks";
import { useRouter } from "next/router";

const Header = () => {
  const router = useRouter();
  const { data } = useTypedSelector((state) => state.user);
  const { logout } = useUserActions();

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand onClick={() => router.push('/')}>GPT CHAT</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {data ? (
                <NavDropdown title={data.name} id="username">
                  <NavDropdown.Item onClick={() => router.push('/profile')}>Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => logout()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link href="/login">
                  <i className="fas fa-user"></i> Sign In
                </Nav.Link>
              )}
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
