"use client"

import { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export default function Header() {
  const [userInfo, setUserInfo] = useState("")

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) {
      const decodedToken = jwtDecode(JSON.parse(userInfo).token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp) {
          if (decodedToken.exp < currentTime) {
            localStorage.removeItem("userInfo")
          } else {
            setUserInfo(userInfo)
          }
      }
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
            <Navbar.Brand href="/">龙菲校服</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
                {userInfo && <Nav.Link href="/cart"><i className="fas fa-shopping-cart"></i> 购物车</Nav.Link>}
                {/* <Nav.Link href="/code"><i className="fa-solid fa-code"></i> Code</Nav.Link> */}
                {userInfo ? (
                  <NavDropdown title={JSON.parse(userInfo).name} id='username'>
                    <NavDropdown.Item onClick={() => router.push('/profile')}><i className="fa-regular fa-user"></i> 账号</NavDropdown.Item>
                    <NavDropdown.Item onClick={logout}><i className="fa-solid fa-right-from-bracket"></i> 退出</NavDropdown.Item>
                  </NavDropdown>
                ): <Nav.Link href="/login"><i className="fa-solid fa-user"></i> 登陆</Nav.Link>}
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    </header>
  );
}