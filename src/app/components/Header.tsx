"use client"

import { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [userInfo, setUserInfo] = useState("")

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      setUserInfo(userInfo)
    }
  }, [])
  const router = useRouter()

  const logout = () => {
    localStorage.removeItem('userInfo')
    setUserInfo("")
    router.push('/')
  }

  return (
    <header>
        <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
            <Navbar.Brand href="/">Trinary Technologies</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
                <Nav.Link href="/shop"><i className="fas fa-shopping-cart"></i> Shop</Nav.Link>
                <Nav.Link href="/code"><i className="fa-solid fa-code"></i> Code</Nav.Link>
                {userInfo ? (
                  <NavDropdown title={JSON.parse(userInfo).name} id='username'>
                    <NavDropdown.Item onClick={() => router.push('/profile')}><i className="fa-regular fa-user"></i> Profile</NavDropdown.Item>
                    <NavDropdown.Item onClick={logout}><i className="fa-solid fa-right-from-bracket"></i> Logout</NavDropdown.Item>
                  </NavDropdown>
                ): <Nav.Link href="/login"><i className="fa-solid fa-user"></i> Login</Nav.Link>}
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </header>
  );
}