var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");

var queryOthers = require('../controllers/queryOthers.controllers');
var authMiddleware = require('../middleware/auth.middleware');

AWS.config.update({
  region: "us-west-2",
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

/* GET home page. */
router.get('/', function(req, res, next) {
  queryOthers.Index(res);
});


router.get('/shop', function(req, res, next) {
  res.render('shop', { selected: 1 });
});

router.get('/product', function(req, res, next) {
  res.render('product', { selected: 2 });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { selected: 3 });
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', { selected: 4 });
});

module.exports = router;
