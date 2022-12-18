
let data;
let conditionData = [];

let ongoingBoxIds = [];

let params;

init();

function init() {

    document.getElementById("errorBox").hidden = true;
    // document.getElementById("errorBox").setAttribute("hidden", true);

    params = [];

    // get all the offer of a ceratin post
    
    if(conditionData.length == 0){
        data = getByCondition().result;
    }else{
        data = conditionData;
    }
    
    //console.log(data);
    // show the offers list
    bindList();


}


let go = document.getElementById("goButton");
go.onclick = function() {
    
    go.innerHTML = "Searching...";
    selectCategory = document.getElementById("selectCategory");
    selectStatus = document.getElementById("selectStatus");

    cate = selectCategory.value;
    stat = selectStatus.value;

    params = {
        "cate": cate,
        "stat": stat
    }

    $.ajax({
        type: "POST",
        // url:'/offers/mySent/'+userId,
        url:'/offers/productsCondition',
        cache: false,
        async: false,
        data: params,
        success: function (data) {
            conditionData = data.result;
            go.innerHTML = "👉Go!";
            document.getElementById("zone1").removeChild(document.getElementById("ongoing"));
            newOngoing = document.createElement("div");
            newOngoing.className = "products";
            newOngoing.setAttribute("id","ongoing");
            document.getElementById("zone1").appendChild(newOngoing);
            init();
        },
        error: function(data) {
            result = data;
        }
    })

}


function getByCondition() {
    
    selectCategory = document.getElementById("selectCategory");
    selectStatus = document.getElementById("selectStatus");

    cate = selectCategory.value;
    stat = selectStatus.value;

    params = {
        "cate": cate,
        "stat": stat
    }
    let result;
    $.ajax({
        type: "POST",
        // url:'/offers/mySent/'+userId,
        url:'/offers/productsCondition',
        cache: false,
        async: false,
        data: params,
        success: function (data) {
            result = data;
            
        },
        error: function(data) {
            result = data;
        }
    })
    return result;
}

function getImage(tagName,imgName){
    document.getElementById(tagName).src = "posts/images/"+imgName;
}

function bindList(elementId){

    let products = document.getElementById("ongoing"); //找到tbody标签
    
    

    for (let i = 0; i < data.length; i++) { //对stus进行循环遍历，并建立tr标签
        id = data[i]._id;

        data[i].itemDesc = data[i].body.slice(0,30) + "...";

        postStatus = data[i].tradeStatus;
        
        let div1 = document.createElement('div');

        
        div1.className = "product";
        products.appendChild(div1);
        let div2 = document.createElement('div');
        div2.className = "product-under";
        div1.appendChild(div2);

        figure = document.createElement("figure");
        figure.className = "product-image";
        div2.appendChild(figure);


        imgName = data[i].imgFile;
        img = document.createElement("img");
        img.src = "/posts/images/"+imgName;
        img.alt=data[i].offerItem;
        figure.appendChild(img);

        div3 = document.createElement("div");
        div3.className = "product-over";
        figure.appendChild(div3);
        
        // offer management button

        mgmButton = document.createElement("a");
        mgmButtonId = "mgmButton" + i;
        mgmButton.setAttribute("id",mgmButtonId);
        mgmButton.className = "btn-small-accept";
        mgmButton.innerHTML = "Provide An Offer";
        mgmButton.href = "/offers/createOffer/" + id;
        myIdMgm = document.createAttribute("myid-mgm");
        myIdMgm.nodeValue = id;
        mgmButton.attributes.setNamedItem(myIdMgm);
        div3.appendChild(mgmButton);

  
        a = document.createElement("a");
        a.href = "/offers/post/"+id;
        a.className = "btn-small-accept";
        a.innerHTML = "Post Details";
        div3.appendChild(a);

        div4 = document.createElement("div");
        div4.className = "product-summary";
        div2.appendChild(div4);

        h4 = document.createElement("h1");
        h4.className = "productName";
        h4.innerHTML = data[i].title;
        div4.appendChild(h4);

        // wearDegree = document.createElement("p");
        // wearDegree.innerHTML = subData[i].wear;
        // div4.appendChild(wearDegree);

        p = document.createElement("p");
        p.innerHTML = data[i].itemDesc;
        div4.appendChild(p);
    }
}