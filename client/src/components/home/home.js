import * as React from 'react';
import NavigationBar from './navbar.js'
import FilterView from './filterview.js'
import ListView from './listview.js'
import DetailView from './detailview.js'
import { Navbar, Nav, Row, Col, Card, Badge, Container, Form, Button } from 'react-bootstrap';

/*
React Architecture:

NavBar => Component
Filters => Component
CardList => Component
CardView => Component
*/

export default function Home() {
    return (
        <div>
            <NavigationBar />
            <Container className="my-3" fluid>
                <Row>
                    <FilterView />
                    <ListView />
                    <DetailView />
                </Row>
            </Container>
        </div>
    );
}