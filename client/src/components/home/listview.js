import * as React from "react";
import { Col } from "react-bootstrap";
import Cell from "./cell";
import { connect } from "react-redux";
import { getPosts } from "../../redux/selectors";

import { selectPost } from "../../redux/actions";
import windowSize from "react-window-size";

function ListView(props) {
  const didSelectPost = (post) => {
    var x = () => {
      props.selectPost(post);
    };
    return x;
  };

  React.useEffect(() => {
    console.log("fetching");
    if (props.post) {
      const foundPosts = props.posts.allPosts.filter((post) => {
        return post.id == props.post;
      });
      if (foundPosts.length > 0) {
        props.selectPost(foundPosts[0]);
      }
    }
  }, [props.post]);

  return (
    <Col
      style={
        props.windowWidth < 400
          ? {
              height: "30vh",
              maxWidth: "100%",
              minWidth: "100%",
              marginTop: "30px",
              marginBottom: "30px",
              overflowY: "auto",
              borderLeft: "0.1px solid #ecf0f1",
            }
          : {
              height: "90vh",
              maxWidth: "25%",
              minWidth: "200px",
              overflowY: "auto",
              borderRight: "0.1px solid #ecf0f1",
              borderLeft: "0.1px solid #ecf0f1",
            }
      }
    >
      <div style={{ height: "0px" }}>
        {props.posts && props.posts.allPosts.length
          ? props.posts.allPosts.map((post) => {
              return (
                <Cell
                  title={post.title}
                  datePosted={new Date(post.date).toLocaleDateString("en-US")}
                  onClick={didSelectPost(post)}
                />
              );
            })
          : ""}
      </div>
    </Col>
  );
}

const mapStateToProps = (state) => {
  const posts = getPosts(state);
  return { posts };
};

export default connect(mapStateToProps, { selectPost })(windowSize(ListView));
