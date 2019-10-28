var AWS = require("aws-sdk");
var formidable = require("formidable");
var fs = require("fs");

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
            res.end();
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
module.exports.AddProduct = (req,res) => {
    var randomID = "P" + parseInt(Math.random() * 1000);
        var paramCheck  = {
            TableName : "Products",
            IndexName : "ProductIDIndex",
            KeyConditionExpression: "ProductID = :productID",
            ExpressionAttributeValues: {
                ":productID": randomID
            }
        }
        docClient.query(paramCheck,function check(err,data){
            if(err) console.log(JSON.stringify(err));
            else {
                  if(data.Items.length == 0) {
                    AddProduct(req,res,randomID);
                }else {
                    randomID = "P" + parseInt(Math.random() * 1000);
                    paramCheck.ExpressionAttributeValues = {
                        ":productID": randomID
                    }
                    docClient.query(paramCheck,check());
                }
            }
        })   
}
function AddProduct(req,res,pid){
    console.log(req.body.CategoryName);
    console.log(req.body.ProductName);
    let form = new formidable.IncomingForm();
    form.uploadDir = "public/img/"
    form.parse(req, function(err, fields, files){
        if(err) console.log(err);
        else {
            let tmpPath = files.files.path;
            let newPath = form.uploadDir + files.files.name;
            fs.rename(tmpPath, newPath, (err) => {
                if (err) throw err;
                fs.readFile(newPath, (err, fileUploaded) => {
                    if(err) console.log(err);
                    console.log("Saved");
                });
            });
        }
    })
    var params = {
        TableName : "Products",
        Item : {
            "CategoryName" : req.body.CategoryName,
            "ProductID" : pid,
            "ProductName" : req.body.ProductName,
            "Brand" : req.body.Brand,
            "Price" : req.body.Price,
            "Picture" : req.body.files
        }
    }
    docClient.put(params,function(err,data){
        if(err) console.log(err);
        else {
            res.end();
        }
    })
}



module.exports.OrderManagement = (req,res) => {
    var paramsOrderID = {
        TableName : "Users",
        IndexName: "StatusIndex",
        KeyConditionExpression: "#st = :status",
        ExpressionAttributeNames:{
            "#st": "Status"
        },
        ExpressionAttributeValues: {
            ":status": "Waiting"
        }
    }
    const promise = new Promise((resolve, reject) => {
        docClient.query(paramsOrderID, function(err, data) {
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
        //res.render('FormAddProduct',{categorys : result});
        res.render('OrderManagement',{orders : result});
    });
    
    //
}

module.exports.setStatus = (req,res) => {

    var varies = req.body.Varies;
    var status = req.body.Status;

    var paramsOrderID = {
        TableName : "Users",
        IndexName: "VariesIndex",
        KeyConditionExpression: "Varies = :varies",
        ExpressionAttributeValues: {
            ":varies": varies
        }
    }

    const promise = new Promise((resolve, reject) => {
        docClient.query(paramsOrderID, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                reject();
            } else {
                /*console.log('im here');
                console.log(data.Items[0]);*/
                return resolve(data.Items[0])
            }
        });
    }).then(result => {
        var params = {
            TableName: "Users",
            Key:{
                "UserID": result.UserID,
                "Varies": result.Varies
            },
            UpdateExpression: "set #st = :status",
            ExpressionAttributeNames:{
                "#st": "Status"
            },
            ExpressionAttributeValues:{
                ":status": status
            },
            ReturnValues:"UPDATED_NEW"
        };
        docClient.update(params, function(err, data) {
            if (err) {
                res.status(404);
            } else {
                res.status(200);
            }
            res.end();
        });
    });
}

module.exports.OrderManagementDetail = (req,res) => {
    var paramsOrderID = {
        TableName : "Users",
        IndexName: "StatusIndex",
        KeyConditionExpression: "#st = :status",
        ExpressionAttributeNames:{
            "#st": "Status"
        },
        ExpressionAttributeValues: {
            ":status": "Waiting"
        }
    }
    const promise = new Promise((resolve, reject) => {
        docClient.query(paramsOrderID, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                reject();
            } else {
                console.log("Query succeeded.");
                return resolve(data.Items);
            }
        });
    }).then(result => {
        console.log(result);
        //res.render('FormAddProduct',{categorys : result});
        res.render('OrderManagementDetail',{orders : result});
    });
}

function getProductByID(productID) {
    return new Promise((resolve,reject) => {
        var paramsProductID = {
            TableName : "Products",
            IndexName : "ProductIDIndex",
            KeyConditionExpression: "ProductID = :productID",
            ExpressionAttributeValues: {
                ":productID": productID
            }
        };
        
        docClient.query(paramsProductID, function(err, data) {
            if (err) {
                return reject(err);
            } else {
                return resolve(data.Items[0]);
            }
        });
    });
}

function asyncFunction(item) {
    
    return new Promise(async (resolve, reject) => {
        var product = await getProductByID(item.ProductID);
        var name = product.ProductName;

        item.name = name;
        resolve(item);
    });
 }

module.exports.getOrderDetail = (req,res) => {

    var orderID = req.params.orderID;

    console.log(orderID);

    var paramsOrderDetail = {
        TableName : "Orders",
        KeyConditionExpression: "OrderID = :orderID",
        ExpressionAttributeValues: {
            ":orderID": orderID
        }
    };
    
    new Promise((resolve, reject) => {
        docClient.query(paramsOrderDetail, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                return resolve(data.Items);
            }
        });
    }).then(result => {
        let promiseArray = result.map(asyncFunction);

        Promise.all(promiseArray).then(result => {
            console.log(result);
        });
        
    });
}