

let userId = "buyer";
let data;

let ongoingButtonIds = [];
let awaitingButtonIds = [];
let finishedButtonIds = [];

let ongoingBoxIds = [];
let awaitingBoxIds = [];
let finishedBoxIds = [];
let failedBoxIds = [];

init();

function init() {

    document.getElementById("errorBox").hidden = true;
    // document.getElementById("errorBox").setAttribute("hidden", true);

    ongoingButtonIds = [];
    awaitingButtonIds = [];
    finishedButtonIds = [];

    ongoingBoxIds = [];
    awaitingBoxIds = [];
    finishedBoxIds = [];
    failedBoxIds = [];

    otherOffersAcceptButtonId = [];
    otherOffersBoxId = [];
    // get all the offer of a ceratin post
    data = getAll().result;
    
    
    // show the offers list
    bindList("ongoing");
    bindList("awaiting");
    bindList("finished");
    bindList("failed");

}


function getAll() {
    let result;
    $.ajax({
        methods: "get",
        // url:'/offers/mySent/'+userId,
        url:'/offers/mysent/get',
        cache: false,
        async: false,
        success: function (data) {
        result = data}
    })
    return result;
}

function getImage(tagName,imgName){
    document.getElementById(tagName).src = "offers/images/"+imgName;
}

function bindList(elementId){

    let products = document.getElementById(elementId); //找到tbody标签
    
    let subData = [];
    if(elementId == "ongoing"){
        for(i=0;i<data.length;i++){
            if(data[i].status == 1){
                subData.push(data[i]);
            }
        }
    }else if(elementId == "awaiting") {
        for(i=0;i<data.length;i++){
            if(data[i].status == 0 || data[i].status == -1){
                subData.push(data[i]);
            }
        }
    }else if(elementId == "finished"){
        for(i=0;i<data.length;i++){
            if(data[i].status == 2){
                subData.push(data[i]);
            }
        }
    }else{
        for(i=0;i<data.length;i++){
            if(data[i].status == -2){
                subData.push(data[i]);
            }
        }
    }

    for (let i = 0; i < subData.length; i++) { //对stus进行循环遍历，并建立tr标签
        id = subData[i]._id;

        switch (subData[i].wear) {
            case '10':
                subData[i].wear = "Like New";
              break;
              case '8':
                subData[i].wear = "Good Condition";
              break;
              case '6':
                subData[i].wear = "Fair Condition";
              break;
              case'4':
              subData[i].wear = "Poor Condition";
              break;
              case '2':
                subData[i].wear = "Need Repair";
              break;
              case '0':
                subData[i].wear = "Sold As Component";
              break;
          }

        subData[i].itemDesc = subData[i].itemDesc.slice(0,30) + "...";

        confirmByBuyer = subData[i].confirmByBuyer;
        // console.log(elementId,id);
        let div1 = document.createElement('div');

        
        
        div1.className = "product";
        products.appendChild(div1);
        let div2 = document.createElement('div');
        div2.className = "product-under";
        div1.appendChild(div2);

        figure = document.createElement("figure");
        figure.className = "product-image";
        div2.appendChild(figure);


        imgName = subData[i].imgName;
        img = document.createElement("img");
        img.src = "images/"+imgName;
        img.alt=subData[i].offerItem;
        figure.appendChild(img);

        div3 = document.createElement("div");
        div3.className = "product-over";
        figure.appendChild(div3);
        
        if(elementId=="ongoing"){

            boxId = elementId+"boxId" + i;
            ongoingBoxIds.push(boxId);
            div1.setAttribute("id",boxId);



            ButtonId = elementId+"confirmButton" + i;
            ongoingButtonIds.push(ButtonId);
            button = document.createElement("button");
            // button.id = acceptButtonId;
            button.setAttribute("id",ButtonId);
            button.className = "btn-small-accept";
            button.innerHTML = "Confirm";
            if(confirmByBuyer == 1){
                button.className = "btn-small-banned";
                button.setAttribute("disabled", "disabled");
                button.innerHTML = "You have confirmed";
            }
            
           
            button.setAttribute("data-myid",id);
            button.onclick = function(){
                
                $.ajax({
                    type: "put",
                    url: "/offers/status/confirmByBuyer/"+ this.getAttribute("data-myid"),
                    cache: false,
                    async: false,
                    success: function (data) {
                        // console.log(data)

                        // alert(data.result);
                        // document.getElementById("zone1").removeChild(document.getElementById("ongoing"));
                        // products = document.createElement("div");
                        // products.className = "products";
                        // products.setAttribute("id","ongoing");
                        // document.getElementById("zone1").appendChild(products);
                        if(data.code == 200){
                            for(i=0;i<ongoingBoxIds.length;i++){
                            document.getElementById("ongoing").removeChild(document.getElementById(ongoingBoxIds[i]));
                            }
                            for(i=0;i<awaitingBoxIds.length;i++){
                                document.getElementById("awaiting").removeChild(document.getElementById(awaitingBoxIds[i]));
                            }
                            for(i=0;i<finishedBoxIds.length;i++){
                                document.getElementById("finished").removeChild(document.getElementById(finishedBoxIds[i]));
                            }
                            for(i=0;i<failedBoxIds.length;i++){
                                document.getElementById("failed").removeChild(document.getElementById(failedBoxIds[i]));
                            }

                            button.className = "btn-small-banned";
                            button.setAttribute("disabled", "disabled");
                            button.innerHTML = "You have confirmed";
                            init();
                            errorBox = document.getElementById("errorBox");
                            errorBox.hidden = false;
                            errorBox.display = true;
                            errorBox.className = "successMessage";
                            errorBox.innerHTML = "You have successfully confirmed the offer!";
                            span = document.createElement("span");
                            span.innerHTML = "×";
                            span.className = "close";
                            span.onclick = function closeWarningBox() {
                                document.getElementById("errorBox").display = false;
                                document.getElementById("errorBox").hidden = true;
                              };
                            errorBox.appendChild(span);
                        }
                    },
                    error: function (data) {
                        
                        errorBox = document.getElementById("errorBox");

                        errorBox.hidden = false;
                        errorBox.display = true;
                        errorBox.innerHTML = data.responseJSON.result;
                        span = document.createElement("span");
                        span.innerHTML = "×";
                        span.className = "close";
                        span.onclick = function closeWarningBox() {
                            document.getElementById("errorBox").display = false;
                            document.getElementById("errorBox").hidden = true;
                          };
                        errorBox.appendChild(span);
                        
                    }
                })
            };
            div3.appendChild(button);
        } else if (elementId=="awaiting"){

            boxId = elementId+"boxId" + i;
            awaitingBoxIds.push(boxId);
            div1.setAttribute("id",boxId);

            editbutton = document.createElement("a");
            editbutton.className = "btn-small-accept";
            editbutton.innerHTML = "Edit";
            editbutton.href = '/offers/edit/'+id;
            div3.appendChild(editbutton);

            
            deletebutton = document.createElement("button");
            deletebutton.className = "btn-small-accept";
            deletebutton.innerHTML = "Delete";

            deletebutton.setAttribute("data-myid",id);

            deletebutton.onclick = function(){
                const ans = window.confirm("Are your sure to delete the offer?");
                if(ans){
                    $.ajax({
                        type: "delete",
                        url: "/offers/offer/"+this.getAttribute("data-myid"),
                        cache: false,
                        async: false,
                        success: function (data) {
    
                            
    
                            for(i=0;i<ongoingBoxIds.length;i++){
                                document.getElementById("ongoing").removeChild(document.getElementById(ongoingBoxIds[i]));
                            }
                            for(i=0;i<awaitingBoxIds.length;i++){
                                document.getElementById("awaiting").removeChild(document.getElementById(awaitingBoxIds[i]));
                            }
                            for(i=0;i<finishedBoxIds.length;i++){
                                document.getElementById("finished").removeChild(document.getElementById(finishedBoxIds[i]));
                            }
                            for(i=0;i<failedBoxIds.length;i++){
                                document.getElementById("failed").removeChild(document.getElementById(failedBoxIds[i]));
                            }
                            init();
                            errorBox = document.getElementById("errorBox");
                            errorBox.hidden = false;
                            errorBox.display = true;
                            errorBox.className = "successMessage";
                            errorBox.innerHTML = "You have successfully deleted the offer!";
                            span = document.createElement("span");
                            span.innerHTML = "×";
                            span.className = "close";
                            span.onclick = function closeWarningBox() {
                                document.getElementById("errorBox").display = false;
                                document.getElementById("errorBox").hidden = true;
                              };
                            errorBox.appendChild(span);
                        },
                        error: function (data) {
                            
                            errorBox = document.getElementById("errorBox");
    
                            errorBox.hidden = false;
                            errorBox.display = true;
                            errorBox.innerHTML = data.responseJSON.result;
                            span = document.createElement("span");
                            span.innerHTML = "×";
                            span.className = "close";
                            span.onclick = "this.parentElement.style.display='none';";
                            errorBox.appendChild(span);
                        }
                    });
                }else{
                    return
                }
                
            };
            div3.appendChild(deletebutton);
        } else if (elementId=="finished"){
            boxId = elementId+"boxId" + i;
            finishedBoxIds.push(boxId);
            div1.setAttribute("id",boxId);
        } else{
            boxId = elementId+"boxId" + i;
            failedBoxIds.push(boxId);
            div1.setAttribute("id",boxId);
        }
    
        

        a = document.createElement("a");
        a.href = "/offers/offer/"+id;
        a.className = "btn-small-accept";
        a.innerHTML = "Offer Details";
        div3.appendChild(a);

        div4 = document.createElement("div");
        div4.className = "product-summary";
        div2.appendChild(div4);

        h4 = document.createElement("h1");
        h4.className = "productName";
        h4.innerHTML = subData[i].offerItem;
        div4.appendChild(h4);

        wearDegree = document.createElement("p");
        wearDegree.innerHTML = subData[i].wear;
        div4.appendChild(wearDegree);

        p = document.createElement("p");
        p.innerHTML = subData[i].itemDesc;
        div4.appendChild(p);
    }
}