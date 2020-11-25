const express = require('express');
const app = express();
const port = 8080;
/* Fuse is our fuzzy searching API. */
const Fuse = require('fuse.js')

var dataset = require('./dump.json');
dataset = dataset.filter((row) => {
  return (row.children.length > 0);
})

const fuse = new Fuse(dataset, {
  keys: ['searchContent']
})

/* Add CORS for debugging. */
var cors = require('cors')
app.use(cors())

/* Add support for JSON payloads in POST requests. */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* A helper function to filter on data. */
function filterData(data, courses, professors, tags) {
  var results = [];
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    /* Ensure that _all_ criteria match (e.g. if user has selected cs189, cs182, and sahai, all of those must match exactly). */
    var skip = false;
    for (var j = 0; j < courses.length; j++) {
      var course = courses[j];
      if (row.courses == null || !row.courses.includes(course)) {
        skip = true;
        break;
      }
    }
    if (skip) continue;
  
    for (var j = 0; j < tags.length; j++) {
      var tag = tags[j];
      if (row.tags == null || !row.tags.includes(tag)) {
        skip = true;
        break;
      };
    }
    if (skip) continue;

    for (var j = 0; j < professors.length; j++) {
      var professor = professors[j];
      if (row.professors == null || !row.professors.includes(professor)) {
        skip = true;
        break;
      };
    }
    if (skip) continue;

    results.push(rowMetadata(row));
  }
  return results;
}

function rowMetadata(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    upvotes: row.upvotes
  }
}

/* Search methods. */
function searchFuzzy(question) {
  return fuse.search(question).map((row) => row.item);
}

function searchRegex(question) {
  var regex = new RegExp(question);
  return dataset.filter((row) => {
    return (row.searchContent.toLowerCase().search(regex) != -1);
  });
}

function searchExact(question) {
  return dataset.filter((row) => {
    return row.searchContent.toLowerCase().includes(question);
  })
}

function searchTitle(question) {
  return dataset.filter((row) => {
    return row.title.toLowerCase().includes(question);
  })
}

app.post('/content', (req, res) => {
  var id = req.body.id || '';
  if (id != '') {
    for (var i = 0; i < dataset.length; i++) {
      if (dataset[i].id == id) {
        res.json(dataset[i]);
        return;
      }
    }
  }
})

app.post('/query', (req, res) => {

  /* First, we unwrap and null-check all parameters, setting default values as we go. */
  var question = req.body.question || '';
  if (question == null) question = '';
  question = question.toLowerCase();

  var mode = req.body.mode || 'auto';
  var sort = req.body.sort || 'auto';
  var courses = req.body.courses || [];
  if (typeof courses == 'string' && courses != '') courses = [courses];
  var professors = req.body.professors || [];
  if (typeof professors == 'string' && professors != '') professors = [professors];
  var tags = req.body.tags || [];
  if (typeof tags == 'string' && tags != '') tags = [tags];

  console.log('Question: ' + question + '; Mode: ' + mode + '; Sort: ' + sort + '; Courses: ' + courses + '; Professors: ' + professors + '; Tags: ' + tags);
  
  /* If no filters were applied and the search query is empty, return an empty dictionary. */
  if (question == '' && (courses.length + professors.length + tags.length == 0)) {
    res.json([]);
    return;
  }

  var data = [];

  /* First, apply our search method. */
  if (question != '') {
    switch (mode) {
      case 'auto':
        data = searchFuzzy(question);
        break;
      case 'regex':
        data = searchRegex(question);
        break;
      case 'exact':
        data = searchExact(question);
        break;
      case 'title':
        data = searchTitle(question);
        break;
    }
  } else {
    data = dataset;
  }

  /* Then, filter data on courses, professors, and tags. */
  data = filterData(data, courses, professors, tags);

  /* Then, apply our sort. */
  switch(sort) {
    case 'auto':
      break;
    case 'upvotes':
      data.sort(function(a, b) {
        return (a.upvotes || 0) > (b.upvotes || 0);
      })
      break;
    case 'date':
      data.sort(function(a, b) {
        return (a.date > b.date) ? -1 : 1
      })
      break;
    case 'default':
      break;
  }
  res.json(data);
})

app.use(express.static('client/build'))
app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })