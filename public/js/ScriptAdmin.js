function getListCategory(){
    var link = "/admin/CategoryManagement"
    $.get(link,function(data,status){
        var content = document.getElementById('main_content');
        content.innerHTML = data
    })
}