var category;
function getProduct(obj){
    var pid = obj.getAttribute('data-id');
    alert(pid);
    var link = obj.getAttribute('data-link-type') + "?pid=" + pid + "&Limit=6";
    alert(link);
    $.get(link,function(data,status){
        var html = data.split("<p>split</p>");
        alert(html[2]);
        document.getElementById("brand").innerHTML = html[0];
        document.getElementById("listProduct").innerHTML = html[1];
        document.getElementById("pagination").innerHTML = html[2];
    })
}
function Filter(){
    var checkbox_brand = document.getElementsByClassName("form-check-input");
    var select_color = document.getElementsByClassName("color");
    var price = document.getElementById("price").textContent.split("-");
    var brand = "";
    var color = "";
    var minPrice = "";
    var maxPrice = "";
    for(var i = 0;i < checkbox_brand.length;i++){
        if(checkbox_brand[i].checked == true) brand += checkbox_brand[i].value;
    }
    
    for(var i = 0;i < select_color.length;i++){
        if(select_color[i].style.cssText != "") color +=  select_color[i].getAttribute("data-value");
    }
    
    if(parseInt(price[0].split("$")[1]) > 10) {
       minPrice = price[0].split("$")[1];
       maxPrice = price[1].split("$")[1];
    }

    if(parseInt(price[1].split("$")[1]) < 1000){
        alert(price[0].split("$")[1]);
        minPrice = price[0].split("$")[1];
        maxPrice = price[1].split("$")[1];
    }

    var link = "/Filter?category=" + category + "&brand=" + brand + "&color=" + color + "&minPrice=" + minPrice + "&maxPrice=" + maxPrice;
    alert(link);

    $.get(link,function(data,status){
        document.getElementById("listProduct").innerHTML = data;
    })
}
function selectColor(obj){
    if(obj.style.cssText != "") obj.style.cssText = "";
    else obj.style = "border-style: solid;border-color:orange;"
}