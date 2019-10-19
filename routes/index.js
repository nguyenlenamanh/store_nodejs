var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");

var queryOthers = require('../controllers/queryOthers.controllers');
var authMiddleware = require('../middleware/auth.middleware');
var cartController = require('../controllers/cart.controllers');


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

router.get('/cart/:id', async function(req, res, next) {
  
  var userID = req.signedCookies.userID;
  var productID = req.params.id;

  var isValid = await cartController.checkUserIDValid(userID);

  console.log(isValid);

  if(isValid) {
    //res.render('cart', { selected: 3 });

    var orderID = await cartController.getCartID(userID);

    await cartController.addProductToOrder(orderID,productID);
  }

  console.log('OK');
});



router.get('/checkout', function(req, res, next) {
  res.render('checkout', { selected: 4 });
});

module.exports = router;
