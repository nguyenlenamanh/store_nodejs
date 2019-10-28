var express = require('express');
var adminController = require('../controllers/admin.controllers');
//Thêm 28-10-2019
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.get('/',function(req,res){
    res.render('admin',{page : ""});
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
router.get('/ProductManagement/',function(req,res){
    adminController.ProductManagement(req,res);
});
router.get('/ListProductAdmin/:category',function(req,res){
    adminController.ListProductAdmin(req,res);
});
router.get('/AddProduct',function(req,res){
    adminController.ReturnFormAdd(res);
});
router.post('/AddProduct',jsonParser,function(req,res){
    adminController.AddProduct(req,res);
});
module.exports = router;