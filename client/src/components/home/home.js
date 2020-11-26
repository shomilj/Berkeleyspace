import * as React from 'react';
import NavigationBar from './navbar.js'
import FilterView from './filterview.js'
import ListView from './listview.js'
import DetailView from './detailview.js'
import { Row, Container } from 'react-bootstrap';

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