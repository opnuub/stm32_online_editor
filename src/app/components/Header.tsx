"use client"
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

export default function Header() {
  return (
    <header>
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="/">Trinary Technologies</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link href="/shop"><i className="fas fa-shopping-cart"></i>Shop</Nav.Link>
                <Nav.Link href="/code"><i className="fa-solid fa-code"></i>Code</Nav.Link>
                <Nav.Link href="/login"><i className="fa-solid fa-user"></i>Login</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </header>
  );
}