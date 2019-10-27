var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey",
    endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.CategoryManagement = (res) => {
    ReturnCategoryList(res);
};
module.exports.AddCategory = (req,res) => {
    console.log(req.body.categoryName);
    var params = {
        TableName: "Others",
        Item: {
            "PrimaryKey" : "Category",
            "SortKey" : req.body.categoryName
        }
    };
    docClient.put(params,function(err,data){
        if(err) console.log(err);
        else {
            ReturnCategoryList(res);
        }
    })
}
function ReturnCategoryList(res){
    var paramsCategories = {
        TableName : "Others",
        ProjectionExpression: "SortKey",
        KeyConditionExpression: "PrimaryKey = :primaryKey",
        ExpressionAttributeValues: {
            ":primaryKey": "Category"
        }
    };
    const promise = new Promise((resolve, reject) => {
        docClient.query(paramsCategories, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                reject();
            } else {
                console.log("Query succeeded.");
                return resolve(data.Items)
            }
        });
    }).then(result => {
        console.log(result);
        res.render('CategoryManagement',{data : result});
    });
}
function ReturnListProduct(req,res){
    var params = {
        TableName : "Others",
        KeyConditionExpression : "PrimaryKey = :primarykey",
        ExpressionAttributeValues :{
            ":primarykey" : "Category"
        }
    }
    docClient.query(params,function(err,data){
        if(err) console.log(err);
        else {
            var paramsAllProductByCategory = {
                TableName : "Products",
                KeyConditionExpression: "CategoryName = :categoryName",
                ExpressionAttributeValues: {
                    ":categoryName": data.Items[0].SortKey,
                },
        }
        const promise = new Promise((resolve, reject) => {
            docClient.query(paramsAllProductByCategory, function(err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                    reject();
                } else {
                    console.log("Query succeeded.");
                    return resolve(data.Items)
                }
            });
        }).then(result => {
            console.log(result);
            var paramsCategories = {
                TableName : "Others",
                ProjectionExpression: "SortKey",
                KeyConditionExpression: "PrimaryKey = :primaryKey",
                ExpressionAttributeValues: {
                    ":primaryKey": "Category"
                }
            };
            docClient.query(paramsCategories, function(err, data) {
                if (err) {
                    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                    reject();
                } else {
                    console.log("Query succeeded.");
                    res.render('ProductManagement',{products : result,categorys : data.Items});
                }
            });
           
        });
        }
    });
}
module.exports.ProductManagement = (req,res) => {
    ReturnListProduct(req,res);
}
function ReturnListProductAdmin(req,res){
    var paramsAllProductByCategory = {
        TableName : "Products",
        KeyConditionExpression: "CategoryName = :categoryName",
        ExpressionAttributeValues: {
            ":categoryName": req.params.category,
        },
}
const promise = new Promise((resolve, reject) => {
    docClient.query(paramsAllProductByCategory, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            reject();
        } else {
            console.log("Query succeeded.");
            return resolve(data.Items)
        }
    });
}).then(result => {
    console.log(result);
    res.render('ListProductAdmin',{products : result});      
    });
}
module.exports.ListProductAdmin = (req,res) =>{
    ReturnListProductAdmin(req,res);
}
module.exports.ReturnFormAdd = (res) => {
    var paramsCategories = {
        TableName : "Others",
        ProjectionExpression: "SortKey",
        KeyConditionExpression: "PrimaryKey = :primaryKey",
        ExpressionAttributeValues: {
            ":primaryKey": "Category"
        }
    };
    const promise = new Promise((resolve, reject) => {
        docClient.query(paramsCategories, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                reject();
            } else {
                console.log("Query succeeded.");
                return resolve(data.Items)
            }
        });
    }).then(result => {
        console.log(result);
        res.render('FormAddProduct',{categorys : result});
    });
}