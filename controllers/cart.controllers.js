var AWS = require("aws-sdk");
var uuid = require('uuid');

AWS.config.update({
    region: "us-west-2",
    accessKeyId: "accessKeyId",
    secretAccessKey: "secretAccessKey",
    endpoint: "http://localhost:8000"
  });
  
var docClient = new AWS.DynamoDB.DocumentClient();

module.exports.checkUserIDValid = function(userID) {
    return new Promise((resolve,reject) => {

        if(!userID) {
            return resolve(false);
        }

        var paramsUserInfo = {
            TableName : "Users",
            KeyConditionExpression: "UserID = :id AND Varies = :varies",
            ExpressionAttributeValues: {
                ":id": userID,
                ":varies" : userID
            }
        }

        docClient.query(paramsUserInfo, function(err, data) {
            if (err) {
                return resolve(false);
            } else {
                if(data.Items.length <= 0) {
                    return resolve(false);
                }
                else if(data.Items.length > 1){
                    return resolve(false);
                }
                else {
                    return resolve(true);
                }
            }
        });
    });
}

module.exports.getCartID = (userID) => {
    return new Promise((resolve,reject) => {
        var paramsCartByCusID = {
            TableName : "Users",
            KeyConditionExpression: "UserID = :id",
            ExpressionAttributeNames:{
                "#st": "Status"
            },
            FilterExpression: "#st = :status",
            ExpressionAttributeValues: {
                ":id": userID,
                ":status": "isCart"
            }
        }

        docClient.query(paramsCartByCusID, async function(err, data) {
            if (err) {
                return reject(err);
            } else {
                if(data.Items.length<=0) {
                    var orderID = await createNewOrder(userID);
                    return resolve(orderID);
                }
                else {
                    var orderID = data.Items[0].Varies;
                    return resolve(orderID);
                } 
            }
        });
    })
}

function createNewOrder(userID) {
    return new Promise((resolve,reject) => {
        var variesID = uuid.v4();

        var today = new Date();
        var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;

        var params = {
            TableName: "Users",
            Item: {
                "UserID": userID,
                "Varies": variesID,
                "Status": "isCart",
                "TotalPrice" : 0,
                "Date" : dateTime,
                "DetailInfo" : {}
            }
        };
        
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));

                return reject("error while creating new order");
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));

                return resolve(variesID);
            }
        });

    })
}

module.exports.addProductToOrder = (orderID, productID, num = 1) => {
    return new Promise(async (resolve,reject) => {
        var product = await getProductByID(productID);

        if(!product) return reject("Not found product");

        var orderDetail = await getOrderDetailByOrderIDAndProductID(orderID,productID);

        if(orderDetail == null) {
            var added = await addNewOrderDetail(orderID,product);

            if(added) console.log('added new order'); 
        }
        else {
            var edited = await setQuantityOfProductInOrder(orderID,productID,num);

            if(edited) console.log('edited order'); 
        }
    });
}

function addNewOrderDetail(orderID,product) {

    console.log(product);

    return new Promise((resolve,reject) => {
        var params = {
            TableName: "Orders",
            Item: {
                "OrderID" : orderID,
                "ProductID" : product.ProductID,
                "Quantity" : 1,
                "Price" : product.Price
            }
        };
    
        docClient.put(params, function(err, data) {
           if (err) {
               console.log(JSON.stringify(err));
           } else {
               return resolve(true);
           }
        });
    })
}

function setQuantityOfProductInOrder(orderID,productID,quantity) {
    return new Promise((resolve,reject) => {
        var params = {
            TableName: "Orders",
            Key:{
                "OrderID": orderID,
                "ProductID": productID
            },
            UpdateExpression: "set Quantity = Quantity + :q",
            ExpressionAttributeValues:{
                ":q": quantity
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                return resolve(false);
            } else {
                return resolve(true);
            }
        });
    });
}

function getOrderDetailByOrderIDAndProductID(orderID,productID) {
    return new Promise((resolve,reject) => {
        var paramsOrderDetail = {
            TableName : "Orders",
            KeyConditionExpression: "OrderID = :orderID AND ProductID = :productID",
            ExpressionAttributeValues: {
                ":orderID": orderID,
                ":productID": productID
            }
        };

        docClient.query(paramsOrderDetail, function(err, data) {
            if (err) {
                return reject("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                return resolve(data.Items[0]);        
            }
        });
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