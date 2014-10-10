var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
    projectName: "DuoJag",
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

module.exports = router;
