var express = require('express');
var adminController = require('../controllers/admin.controllers');

var router = express.Router();

router.get('/',function(req,res){
    res.render('admin');
});
router.get('/CategoryManagement',function(req,res){
    adminController.CategoryManagement(res);
});
module.exports = router;