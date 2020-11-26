import * as React from 'react';
import { Navbar, Nav, Row, Col, Card, Badge, Container, Form, Button } from 'react-bootstrap';

export default function NavigationBar() {
    return (
        <Navbar bg="light" style={{maxHeight: "10vh"}}>
            <Navbar.Brand className="bt-bold" href="/">EECS 101</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
                <Nav.Link className="bt-bold nav-link" href="/">Home</Nav.Link>
                {/* <Nav.Link className="bt-bold nav-link" href="/about">About</Nav.Link> */}
            </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}