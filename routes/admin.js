var express = require('express');
var adminController = require('../controllers/admin.controllers');

var router = express.Router();

router.get('/',function(req,res){
    res.render('admin');
});
router.get('/CategoryManagement',function(req,res){
    adminController.CategoryManagement(res);
});
router.post('/AddCategory',function(req,res){
    adminController.AddCategory(req,res);
});
router.get('/ProductManagement/:category',function(req,res){
    adminController.ProductManagement(req,res);
});
router.get('/ListProductAdmin/:category',function(req,res){
    adminController.ListProductAdmin(req,res);
});
router.get('/AddProduct',function(req,res){
    adminController.ReturnFormAdd(res);
});
module.exports = router;