/* This file contains the lightweight Express/NodeJS backend for https://eecs101.org/. */

const express = require('express');
const app = express();

/* Add support for fetch. */
const fetch = require("node-fetch");

/* Heroku uses process.env.PORT */
const port = process.env.PORT || 8080;

/* TODO: Implement SSL/HTTPS redirection. */
// var sslRedirect = require('heroku-ssl-redirect');
// app.use(sslRedirect());

/* Add CORS. */
var cors = require('cors')
app.use(cors())

/* Add support for JSON payloads in POST requests. */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Import metadata.json for the course map (it's used for preprocessing the search query). */
const metadata = require('./metadata.json');
const coursemap = metadata.coursemap;

/* Import dump.json for the cached Piazza dataset. Filter to only posts with at least one response. */
var dataset = require('./dump.json');
dataset = dataset.filter((row) => { return (row.children.length > 0); })

/* Fuse is our fuzzy searching API. */
const Fuse = require('fuse.js')
const fuse = new Fuse(dataset, {
  keys: ['searchContent']
})

/* -------------- SECTION: Filtering Methods ----------------- */

/* A helper function to filter on data. */
function filterData(data, question, courses, professors, tags, isAuto) {
  var results = [];

  /* For 'auto' search mode, we perform query preprocessing to extract classes and keywords 
      from the search query. We add a special case for when we see the keyword "workload" */
  var filterOnWorkload = false;
  if (isAuto) {
    var parts = question.split(' ');
    
    /* Iterate through each word in the search query, looking for courses. */
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i].toUpperCase();
      var entry = coursemap[part];
      if (entry != null && !courses.includes(entry)) courses.push(entry);
    }

    /* Special flag for when we're searching for 'workload' */
    if (parts.includes('workload')) filterOnWorkload = true;
  }

  /* Perform strict filter matching. */
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var skip = false;

    /* Filter on courses. */
    for (var j = 0; j < courses.length; j++) {
      var course = courses[j];
      if (row.courses == null || !row.courses.includes(course)) {
        skip = true;
        break;
      }
    }
    if (skip) continue;

    /* Filter on workload. */
    if (filterOnWorkload && !row.searchContent.includes('workload')) {
      continue;
    }
    
    /* Filter on tags. */
    for (var j = 0; j < tags.length; j++) {
      var tag = tags[j];
      if (row.tags == null || !row.tags.includes(tag)) {
        skip = true;
        break;
      };
    }
    if (skip) continue;

    /* Filter on professors. */
    for (var j = 0; j < professors.length; j++) {
      var professor = professors[j];
      if (row.professors == null || !row.professors.includes(professor)) {
        skip = true;
        break;
      };
    }
    if (skip) continue;

    /* Our filtering is complete; push a stripped-down version of the row. */
    results.push(rowMetadata(row));
  }
  return results;
}

function rowMetadata(row) {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    upvotes: row.upvotes,
    source: 'piazza'
  }
}

/* -------------- SECTION: Search Methods ----------------- */

function searchFuzzy(question) {
  return fuse.search(question).map((row) => row.item);
}

function searchRegex(question) {
  /* TODO: Improve regex search (this is buggy and not currently implemented) */
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

function queryPiazza(question, courses, professors, tags, mode) {
  /* First, apply our search method. */
  var data = [];
  var isAuto = false;
  if (question != '') {
    switch (mode) {
      case 'auto':
        data = searchFuzzy(question);
        isAuto = true;
        break;
      case 'fuzzy':
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
  data = filterData(data, question, courses, professors, tags, isAuto);
  return data;
}

async function queryReddit(question, courses, professors, tags) {
  var data = [];
  const response = await fetch('https://www.reddit.com/r/berkeley/search.json?q=' + question + '&restrict_sr=true')
  const record = await response.json();
  if (record == null) return [];
  record.data.children.forEach((row) => {
    var date = new Date(0);
    date.setUTCSeconds(row.data.created_utc);
    data.push({
      id: row.data.url,
      title: row.data.title,
      date: date,
      upvotes: row.data.ups,
      permalink: row.data.permalink,
      source: 'reddit'
    });
  })
  return data;
}

function sortData(data, sort) {
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
    return data;
}

/* -------------- SECTION: Routing ----------------- */

function returnRedditHits(url, title, res) {
  res.json({
    title: title,
    tags: ['reddit'],
    content: 'To open this post on Reddit, click ' + '<a href="' + url + '" target="_blank">here.</a>',
    upvotes: 0,
    id: url,
    professors: [],
    children: [],
    courses: [],
    date: new Date().toString()
  })
}

/* Returns post content for a given post. */
app.post('/content', (req, res) => {
  var id = req.body.id || '';
  var source = req.body.source || '';
  var title = req.body.title || '';
  if (id != '' && source != '') {
    if (source == 'reddit') {
      returnRedditHits(id, title, res);
      return;
    } else {
      for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].id == id) {
          res.json(dataset[i]);
          return;
        }
      }
    }
  }
})

/* Returns a list of applicable posts' metadata. */
app.post('/query', (req, res) => {

  /* First, we unwrap and null-check all parameters, setting default values as we go. */
  var question = req.body.question || '';
  if (question == null) question = '';
  question = question.toLowerCase();

  var source = req.body.source || 'piazza';
  var mode = req.body.mode || 'auto';
  var sort = req.body.sort || 'auto';
  var courses = req.body.courses || [];
  if (typeof courses == 'string' && courses != '') courses = [courses];
  var professors = req.body.professors || [];
  if (typeof professors == 'string' && professors != '') professors = [professors];
  var tags = req.body.tags || [];
  if (typeof tags == 'string' && tags != '') tags = [tags];

  /* If no filters were applied and the search query is empty, return an empty dictionary. */
  if (question == '' && (courses.length + professors.length + tags.length == 0)) {
    res.json([]);
    return;
  }

  var data = [];
  if (source == 'piazza') {
    data = queryPiazza(question, courses, professors, tags, mode);
    data = sortData(data, sort);
    res.json(data);
  } else if (source == 'reddit') {
     queryReddit(question, courses, professors, tags).then(records => {
       data = records;
       sortData(data, sort);
       res.json(data);
    });
  }
})

app.use(express.static('client/build'))
app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })