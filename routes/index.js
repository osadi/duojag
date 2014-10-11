var express = require('express');
var router = express.Router();

var stations = require('../stations');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    projectName: "DuoJag",
    stations: stations,
    partials: {
      layout: 'layout'
    }
  });
});

/* Matches page */
router.get('/match', function(req, res) {
  res.render('match', {
    projectName: "DuoJag",
    partials: {
      layout: 'layout'
    }
  });
});

/* Waiting page */
router.get('/waiting', function(req, res) {
  res.render('waiting', {
    projectName: "DuoJag",
    partials: {
      layout: 'layout'
    }
  });
});

router.post('/search', function(req, res) {
    console.log(req.body);
    res.render('waiting', {
        projectName: "DuoJag",
        partials: {
            layout: 'layout'
        }
    });
});

module.exports = router;
