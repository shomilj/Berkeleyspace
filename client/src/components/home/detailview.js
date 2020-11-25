import * as React from 'react';
import { Navbar, Nav, Row, Col, Card, Badge, Container, Form, Button } from 'react-bootstrap';
import Cell from './cell';
import { connect } from "react-redux";
import { getSelectedPost } from "../../redux/selectors";

class DetailView extends React.Component {

    constructor(props) {
        super(props);
        this.selectedPost = null;
    }

    emptyPage = () => {
        return 'Empty page.'
    }

    postPage = () => {
        return (
            <div>
                <Row className="m-1">
                <h3 dangerouslySetInnerHTML={{__html: this.props.selectedPost.title}}></h3></Row>
            <Row className="m-1">
                {this.props.selectedPost.courses ? this.props.selectedPost.courses.map((child) => {
                    return (
                        <Badge className="m-1" variant="info">{child}</Badge>
                    )
                }) : ''}
                {this.props.selectedPost.professors ? this.props.selectedPost.professors.map((child) => {
                    return (
                        <Badge className="m-1" variant="success">{child}</Badge>
                    )
                }) : ''}
                {this.props.selectedPost.tags ? this.props.selectedPost.tags.map((child) => {
                    return (
                        <Badge className="m-1" variant="warning">{child}</Badge>
                    )
                }) : ''}
            </Row>
            <Row className="m-1">
                {this.props.selectedPost.date ? <p className="m-1" style={{color: 'lightgray', fontSize: "14px"}}>Posted on {new Date(this.props.selectedPost.date).toLocaleDateString("en-US")}.</p> : ''}
            </Row>
            <Row className="mt-4 m-2">
                <p dangerouslySetInnerHTML={{__html: this.props.selectedPost.content}} style={{fontSize: "14px"}}>
                    
                </p>
            </Row>
            
            {
                this.props.selectedPost.children ?
                this.props.selectedPost.children.map((child) => {
                    return (
                        <Card className="my-2" style={{width: "100%", borderColor: "#ededed"}}>
                            <div className="m-2">
                                <p className="m-1" dangerouslySetInnerHTML={{__html: child.content}} style={{fontSize: "14px"}}>
                                </p>
                                <p className="mx-1 my-2" style={{fontSize: "10px", color: "gray"}}>
                                    {child.date}
                                </p>
                                {child.children.map((followup) => {
                                    return (
                                        <Card className="my-2" style={{width: "100%", borderColor: "#ededed"}}>
                                            <div className="m-2">
                                                <p dangerouslySetInnerHTML={{__html: followup.content}} className="m-1" style={{fontSize: "14px"}}>
                                                </p>
                                                <p className="mx-1 my-2" style={{fontSize: "10px", color: "gray"}}>
                                                    {followup.date}
                                                </p>
                                            </div>
                                        </Card>
                                    )
                                })}
                            </div>
                        </Card>
                    )
                }) : ''
            }
            </div>
        )
    }

    render() {
        return (
            <Col className="m-1" style={{overflowY: "auto", height: "90vh"}}>
                {this.props.selectedPost ? this.postPage() : this.emptyPage()
                }
            </Col>
        );
    }

}

const mapStateToProps = state => {
    // const posts = getPosts(state);
    // return { posts };
    const selectedPost = getSelectedPost(state);
    return {selectedPost};
};

export default connect(
    mapStateToProps
)(DetailView);