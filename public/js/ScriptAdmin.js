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
    $.post(link,JSON.stringify({'categoryName' : value}),function(data,status){
        var content = document.getElementById('main_content');
        content.innerHTML = data;
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