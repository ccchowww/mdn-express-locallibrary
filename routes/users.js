var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a butt');
});

router.get('/cool', (req, res, next) => (
  res.send('my butthole')
)
);

module.exports = router;
