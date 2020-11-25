import * as React from 'react';
import { Navbar, Nav, Row, Col, Card, Badge, Container, Form, Button } from 'react-bootstrap';

export default function Cell(props) {
    return (
        <div>
            <div className="filter-card" onClick={props.onClick}>
                <div className="filter-card-container">
                    <div className="filter-card-info">
                        <h6 dangerouslySetInnerHTML={{__html: props.title}}></h6>
                        <p className="filter-card-info-desc">{props.datePosted}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}