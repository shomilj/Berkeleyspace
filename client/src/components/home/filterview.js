
import { Row, Col, Form } from 'react-bootstrap';
import { connect } from "react-redux";
import { updateSearch } from "../../redux/actions";

import ReactGA from 'react-ga';
import * as React from 'react';
import Select from 'react-select'

const SEARCH_TYPES = [
  { value: 'auto', label: 'Auto'},
  { value: 'exact', label: 'Exact'},
  { value: 'fuzzy', label: 'Fuzzy'},
  { value: 'title', label: 'Title Only'}
]

const SORT_TYPES = [
  {value: 'auto', label: 'Auto'},
  {value: 'date', label: 'Date'},
]

const metadata = require('../../metadata.json');
const courses = metadata.courses.map((course) => {
  return {value: course, label: course}
});
const professors = metadata.profs.map((prof) => {
  return {value: prof, label: prof}
});

class FilterBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = { question: [], mode: 'auto', sort: 'auto', courses: [], professors: [], tags: [] }
  }
  
  componentDidMount() {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  updateQuestion = question => {
    this.setState({question: question}, () => {
      // this.props.updateSearch(this.state)
    })
  }
  updateSort = sort => {
    this.setState({sort: sort.value}, () => {
      this.props.updateSearch(this.state)
    })
  }
  updateMode = mode => {
    this.setState({mode: mode.value}, () => {
      this.props.updateSearch(this.state)
    })
  }
  updateCourses = courses => {
    this.setState({courses: courses}, () => {
      this.props.updateSearch(this.state)
    })
  }
  updateProfessors = professors => {
    this.setState({professors: professors}, () => {
      this.props.updateSearch(this.state)
    })
  }
  updateTags = tags => {
    this.setState({tags: tags}, () => {
      this.props.updateSearch(this.state)
    })
  }

  enteredSearchTerm = (e) => {
    if (e.keyCode == 13) {
      this.props.updateSearch(this.state)
      // var query = []
      // var parts = this.state.question.split(' ');
      // var coursesToAdd = [];
      // for (var i = 0; i < parts.length; i++) {
      //   var part = parts[i];
      //   if (coursemap[part.toLowerCase()] != null) {
      //     if (i > 0 && ['cs', 'ee', 'eecs'].includes(parts[i-1].toLowerCase())) {
      //       query[i-1] = ''
      //     };
      //     coursesToAdd.push(coursemap[part.toLowerCase()]);
      //   } else {
      //     query.push(part);
      //   }
      // }
      // var existingCourses = this.state.courses;
      // for (var i = 0; i < coursesToAdd; i++) {
      //   if (!existingCourses.includes(coursesToAdd[i])) {
      //     existingCourses.push(coursesToAdd[i]);
      //   }
      // }
      // console.log('Courses: ' + existingCourses);
      // this.setState({question: query.join(' '), courses: existingCourses}, () => {
      //   this.props.updateSearch(this.state)
      // });
    }
  }


  render() {
    return (
      <Col style={{height: "90vh", maxWidth: "25%", minWidth: "200px",  overflowY: "auto", borderLeft: "0.1px solid #ecf0f1"}}>
        <Form className="m-3">
          <Row className="my-4">
            <h5>Filters</h5>
          </Row>
          <Row className="my-4">
            <Form.Control placeholder="Search for a question..." value={this.state.question} onChange={e => this.updateQuestion(e.target.value)} onKeyDown={this.enteredSearchTerm}/>
          </Row>
          <Row className="my-4">
            <div style={{minWidth: "100%"}}>
              <h6 className="my-1">Search Type</h6>
              <Select options={SEARCH_TYPES} onChange={e => this.updateMode(e)} value={SEARCH_TYPES.filter((t) => t.value == this.state.mode)}/>
            </div>
          </Row>
          <Row className="my-4">
            <div style={{minWidth: "100%"}}>
              <h6 className="my-1">Sort By</h6>
              <Select options={SORT_TYPES} onChange={e => this.updateSort(e)} value={SORT_TYPES.filter((t) => t.value == this.state.sort)}/>
            </div>
          </Row>
          <Row className="my-4">
            <div style={{minWidth: "100%"}}>
              <h6 className="my-1">Courses</h6>
              <Select isClearable isMulti options={courses} onChange={e => this.updateCourses(e ? e.map(x => x.value) : [])} value={courses.filter((t) => this.state.courses.includes(t.value))} placeholder="Filter by course." />
            </div>
          </Row>
          <Row className="my-4">
            <div style={{minWidth: "100%"}}>
              <h6 className="my-1">Professors</h6>
              <Select isClearable isMulti options={professors} onChange={e => this.updateProfessors(e ? e.map(x => x.value) : [])} placeholder="Filter by professor." />
            </div>
          </Row>
          {/* <Row className="my-4">
            <h6>Tags</h6>
            <div style={{minWidth: "100%"}}>
              <Select isClearable isMulti options={tags} onChange={e => this.updateTags(e.map(x => x.value))} placeholder="Filter by type." />
            </div>
          </Row> */}
        </Form>
      </Col>
      )
  }
}

export default connect(
  null,
  { updateSearch }
)(FilterBox);