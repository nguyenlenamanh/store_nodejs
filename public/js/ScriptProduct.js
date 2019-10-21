var category;
var pid_save;
var Limit = 6;
var pid = null;
var first;
function CreateTagA(pid_save){
    if(typeof(pid_save) == "string"){
        var a = document.createElement("a");
        a.setAttribute("class","page-link");
        a.setAttribute("href","#");
        a.setAttribute("data-link-type",obj.getAttribute('data-link-type'));
        a.setAttribute("data-id","P" + (parseInt(pid_save) - parseInt(Limit)));
        a.setAttribute("onclick","getProduct(this)");
        a.setAttribute("id","back")
        a.innerHTML = "Back"
        document.getElementById("pagination").appendChild(a);
    }  
}
function CreateTagScript(html){
    var scriptElement = document.createElement( "script" );
        scriptElement.setAttribute("id","handle");
        scriptElement.src = html;
        document.getElementById("script").appendChild(scriptElement);
}
function getProduct(obj,status_change){
    var pid = obj.getAttribute('data-id');
    if(pid != null) pid_save = pid.split("P")[1];
    var link = obj.getAttribute('data-link-type') + "?pid=" + pid + "&Limit=" + Limit;
    category = obj.getAttribute('data-link-type').split("/")[2];
    //alert(typeof(pid_save));
    $.get(link,function(data,status){
        var html = data.split("<p>split</p>");

        if(parseInt(status_change) != 2) document.getElementById("brand").innerHTML = html[0];
        document.getElementById("listProduct").innerHTML = html[1];
        //alert(document.getElementById("pagination").querySelectorAll(".page-item"));
        if(document.getElementById("pagination").querySelectorAll(".page-item").length == 0) document.getElementById("pagination").innerHTML = html[2];
        //if(document.getElementById("back") != null) document.getElementById("pagination").removeChild(document.getElementById("back"));
        if(document.getElementById("handle") != null) document.getElementById("script").removeChild(document.getElementById("handle"));
        //CreateTagA(pid_save);
        CreateTagScript(html[3]);
    })
}
var check_brand;
var check_color;
var check_price;
function Filter(obj){
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
    if(brand != "") check_brand = "true";
    else  check_brand = "false";
    for(var i = 0;i < select_color.length;i++){
        if(select_color[i].style.cssText != "") color +=  select_color[i].getAttribute("data-value");
    }
    if(color != "") check_color = "true";
    else  check_color = "false";
    if(parseInt(price[0].split("$")[1]) > 10 || parseInt(price[1].split("$")[1]) < 1000) {
       minPrice = price[0].split("$")[1];
       maxPrice = price[1].split("$")[1];
    }
    if(minPrice != "" || maxPrice != "") check_price = "true";
    else check_price = "false";
    /*if(parseInt(price[1].split("$")[1]) < 1000){
        //alert(price[0].split("$")[1]);
        minPrice = price[0].split("$")[1];
        maxPrice = price[1].split("$")[1];
    }*/
    var link;
    if(obj.getAttribute('data-id') == null)
        link = "/Filter?category=" + category + "&brand=" + brand + "&color=" + color + "&minPrice=" + minPrice + "&maxPrice=" + maxPrice + "&Limit=" + Limit;
    else link = "/Filter?category=" + category + "&brand=" + brand + "&color=" + color + "&minPrice=" + minPrice + "&maxPrice=" + maxPrice + "&Limit=" + Limit + "&pid=" + obj.getAttribute('data-id'); 
    //alert(link);

    $.get(link,function(data,status){
        var html = data.split("<p>split</p>");
        document.getElementById("listProduct").innerHTML = html[0];
        document.getElementById("pagination").innerHTML = html[1];
        if(document.getElementById("handle") != null) document.getElementById("script").removeChild(document.getElementById("handle"));
        var scriptElement = document.createElement( "script" );
        scriptElement.setAttribute("id","handle");
        scriptElement.src = html[2];
        document.getElementById("script").appendChild(scriptElement);
    })
}
function selectColor(obj){
    if(obj.style.cssText != "") obj.style.cssText = "";
    else obj.style = "border-style: solid;border-color:orange;"
}
function Change(obj){
    Limit = obj.value;
    Filter(obj);
}
function GetProductPage(obj){
    if(check_brand == "true" || check_color == "true" || check_Price == "true") Filter(obj);
    else getProduct(obj,2);
}