function getListCategory(){
    var link = "/admin/CategoryManagement"
    $.get(link,function(data,status){
        var content = document.getElementById('main_content');
        content.innerHTML = data
    })
}
function AddCategory(id){
    var value = document.getElementById(id).value;
    var link = "/admin/AddCategory"
    $.post(link,{'categoryName' : value},function(data){
        location.reload();
   })
}
function getListProduct(){
    var link = "/admin/ProductManagement/null";
    //var link = "/admin/ProductManagement/" + document.getElementById("select-category").value;
    $.get(link,function(data,status){
        var content = document.getElementById('main_content');
        content.innerHTML = data;
    })
}
function select(){
    var link = "/admin/ListProductAdmin/" + document.getElementById("select-category").value;
    //alert(document.getElementById("select-category").value);
    $.get(link,function(data,status){
        var content = document.getElementById('admin_product');
        content.innerHTML = data;
    })
}
function getForm(){
    var link = "/admin/AddProduct";
    $.get(link,function(data,status){
        var content = document.getElementById('main_content');
        content.innerHTML = data;
    })
}
var listPic = [];
function picture(){
    listPic = [];
    var file = document.getElementById("files");
    for(var i = 0;i<file.files.length;i++){
        listPic.push(file.files[i]);
    }
}
function submit(category,product_name,brand,price){
    var link = "/admin/AddProduct";
    var cate = document.getElementById(category).value;
    var productName = document.getElementById(product_name).value;
    var brand = document.getElementById(brand).value;
    var price = document.getElementById(price).value;  
    alert(listPic[0].name);
    $.post(link,{
        "CategoryName" :cate,
        "ProductName" : productName,
        "Brand" : brand,
        "Price" : price,
        "Pictures" : listPic
    },function(data,status){
        location.reload();
    })
}

function Save(id) {
    //alert(id);

    var dpId = '#SelectLm' + id;

    var dpValue = $(dpId).val();

    $.post("/admin/setStatus",{
        "Varies": id,
        "Status": dpValue
    },function(data,status){
        $.get("/admin/OrderManagementDetail",function(data,status){
            var content = document.getElementById('orders');
            content.innerHTML = data;
        })
    });
}

$(document).on("click", ".open-AddBookDialog", function () {
    var myBookId = $(this).data('id');
    $(".modal-body #bookId").val( myBookId );

    alert(myBookId);
    // As pointed out in comments, 
    // it is unnecessary to have to manually call the modal.
    // $('#addBookDialog').modal('show');
});