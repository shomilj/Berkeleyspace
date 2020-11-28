import * as React from "react";
import { Row, Col, Card, Badge } from "react-bootstrap";
import { connect } from "react-redux";
import { getSelectedPost } from "../../redux/selectors";
import windowSize from 'react-window-size';

/* The DetailView component is the component that displays detailed information about a post,
    including the post content and followups. */
class DetailView extends React.Component {

  constructor(props) {
    super(props);
    this.selectedPost = null;
  }

  emptyPage = () => {
    return "Empty page.";
  };

  postPage = () => {
    return (
      <div>
        {this.props.loadingDetail ? (
          <div style={{ height: "1005" }} className="justify-content-md-center">
          </div>
        ) : (
          <div>
            <Row className="m-1">
              <h3
                dangerouslySetInnerHTML={{
                  __html: this.props.selectedPost.title,
                }}
              ></h3>
            </Row>
            <Row className="m-1">
              {this.props.selectedPost.courses
                ? this.props.selectedPost.courses.map((child) => {
                    return (
                      <Badge className="m-1" variant="info">
                        {child}
                      </Badge>
                    );
                  })
                : ""}
              {this.props.selectedPost.professors
                ? this.props.selectedPost.professors.map((child) => {
                    return (
                      <Badge className="m-1" variant="success">
                        {child}
                      </Badge>
                    );
                  })
                : ""}
              {this.props.selectedPost.tags
                ? this.props.selectedPost.tags.map((child) => {
                    return (
                      <Badge className="m-1" variant="warning">
                        {child}
                      </Badge>
                    );
                  })
                : ""}
            </Row>
            <Row className="m-1">
              {this.props.selectedPost.date ? (
                <p
                  className="m-1"
                  style={{ color: "lightgray", fontSize: "14px" }}
                >
                  Posted on{" "}
                  {new Date(this.props.selectedPost.date).toLocaleDateString(
                    "en-US"
                  )}
                  .
                </p>
              ) : (
                ""
              )}
            </Row>
            <Row className="mt-4 m-2">
              <p
                dangerouslySetInnerHTML={{
                  __html: this.props.selectedPost.content,
                }}
                style={{ fontSize: "14px" }}
              ></p>
            </Row>

            {this.props.selectedPost.children
              ? this.props.selectedPost.children.map((child) => {
                  return (
                    <Card
                      className="my-2"
                      style={{ width: "100%", borderColor: "#ededed" }}
                    >
                      <div className="m-2">
                        <p
                          className="m-1"
                          dangerouslySetInnerHTML={{ __html: child.content }}
                          style={{ fontSize: "14px" }}
                        ></p>
                        <p
                          className="mx-1 my-2"
                          style={{ fontSize: "10px", color: "gray" }}
                        >
                          {child.date}
                        </p>
                        {child.children.map((followup) => {
                          return (
                            <Card
                              className="my-2"
                              style={{ width: "100%", borderColor: "#ededed" }}
                            >
                              <div className="m-2">
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: followup.content,
                                  }}
                                  className="m-1"
                                  style={{ fontSize: "14px" }}
                                ></p>
                                <p
                                  className="mx-1 my-2"
                                  style={{ fontSize: "10px", color: "gray" }}
                                >
                                  {new Date(followup.date).toLocaleDateString(
                                    "en-US"
                                  )}
                                </p>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })
              : ""}
          </div>
        )}
      </div>
    );
  };

  render() {
    return (
      <Col className="m-1" style={this.props.windowWidth < 400 ? { overflowY: "auto"} : { overflowY: "auto", height: "90vh" }}>
        {this.props.selectedPost ? this.postPage() : this.emptyPage()}
      </Col>
    );
  }
}

const mapStateToProps = (state) => {
  const selectedPost = getSelectedPost(state);
  return { selectedPost: selectedPost };
};

export default connect(mapStateToProps)(windowSize(DetailView));
