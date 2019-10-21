var express = require('express');
var router = express.Router();
var AWS = require("aws-sdk");

var queryOthers = require('../controllers/queryOthers.controllers');
var authMiddleware = require('../middleware/auth.middleware');
var cartController = require('../controllers/cart.controllers');
var shopController = require('../controllers/shop.controllers');

/* GET home page. */
router.get('/', function(req, res, next) {
  queryOthers.Index(res);
});


router.get('/shop', function(req, res, next) {
  shopController.getAllCategory(res);
});
router.get('/shop/:category', function(req, res, next) {
  shopController.getProductByCategory(req,res);
});
router.get('/Filter',function(req,res,next){
  shopController.Filter(req,res);
})

router.get('/product', function(req, res, next) {
  //console.log(req.cookies.ppkcookie);
  res.render('product', { selected: 2 });
});

router.get('/cart', function(req, res, next) {
  res.render('cart', { selected: 3 });
});

router.post('/cart/:id', async function(req, res, next) {
  
  var userID = req.signedCookies.userID;
  var productID = req.params.id;

  var isValid = await cartController.checkUserIDValid(userID);

  console.log(isValid);

  if(isValid) {
    //res.render('cart', { selected: 3 });

    var orderID = await cartController.getCartID(userID);

    try {
      await cartController.addProductToOrder(orderID,productID);

      res.status(200).send('OK');
    }
    catch(err) {
      res.status(400).send(err);
    }
  }

  res.status(400).send("Failed");
});

router.get('/checkout', function(req, res, next) {
  res.render('checkout', { selected: 4 });
});

module.exports = router;
