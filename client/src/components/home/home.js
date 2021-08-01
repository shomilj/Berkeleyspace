import * as React from "react";
import NavigationBar from "./navbar.js";
import FilterView from "./filterview.js";
import ListView from "./listview.js";
import DetailView from "./detailview.js";
import { Row, Container } from "react-bootstrap";
var qs = require("qs");

export default function Home({ match, location }) {
  const query = location?.search;
  var question = "";
  var post = "";
  if (query && query.length > 0) {
    const parsed = qs.parse(query.substring(1));
    question = parsed?.question || "";
    post = parsed?.post || "";
  }

  return (
    <div>
      <NavigationBar />
      <Container className="my-3" fluid>
        <Row>
          <FilterView question={question} />
          <ListView post={post} />
          <DetailView />
        </Row>
      </Container>
    </div>
  );
}
