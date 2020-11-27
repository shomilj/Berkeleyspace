import * as React from 'react';
import { Col } from 'react-bootstrap';
import Cell from './cell';
import { connect } from "react-redux";
import { getPosts } from "../../redux/selectors";

import { selectPost } from "../../redux/actions";

class ListView extends React.Component {

    didSelectPost = (post) => {
        var x = () => {
            this.props.selectPost(post);
        }
        return x;
    }

    render() {
        return (
            <Col style={{height: "90vh", maxWidth: "25%", minWidth: "200px", overflowY: "auto", borderRight: "0.1px solid #ecf0f1", borderLeft: "0.1px solid #ecf0f1"}}>
                <div style={{height: "0px"}}>
                    {
                        this.props.posts && this.props.posts.allPosts.length ? this.props.posts.allPosts.map((post) => {
                            return <Cell title={post.title} datePosted={new Date(post.date).toLocaleDateString("en-US")} onClick={this.didSelectPost(post)}/>
                        })
                        : ""
                    }
                </div>
            </Col>
        )
    }

}
  
const mapStateToProps = state => {
    const posts = getPosts(state);
    return { posts };
};

export default connect(
    mapStateToProps,
    { selectPost }
)(ListView);