
let data;

let ongoingButtonIds = [];
let finishedButtonIds = [];

let ongoingBoxIds = [];
let finishedBoxIds = [];

init();

function init() {

    document.getElementById("errorBox").setAttribute("hidden", true);

    ongoingButtonIds = [];
    finishedButtonIds = [];

    ongoingBoxIds = [];
    finishedBoxIds = [];

    otherOffersAcceptButtonId = [];
    otherOffersBoxId = [];
    // get all the offer of a ceratin post
    data = getAll().result;
    
    
    // show the offers list
    bindList("ongoing");
    bindList("finished");
    

}


function getAll() {
    let result;
    $.ajax({
        methods: "get",
        // url:'/offers/mySent/'+userId,
        url:'/users/mysent/get',
        cache: false,
        async: false,
        success: function (data) {
        result = data}
    })
    return result;
}

function getImage(tagName,imgName){
    document.getElementById(tagName).src = "posts/images/"+imgName;
}

function bindList(elementId){

    let products = document.getElementById(elementId); //找到tbody标签
    
    let subData = [];
    if(elementId == "ongoing"){
        for(i=0;i<data.length;i++){
            if(data[i].status == 1 || data[i].status == 0){
                subData.push(data[i]);
            }
        }
    }else if(elementId == "finished"){
        for(i=0;i<data.length;i++){
            if(data[i].status == 2){
                subData.push(data[i]);
            }
        }
    }

    for (let i = 0; i < subData.length; i++) { //对stus进行循环遍历，并建立tr标签
        id = subData[i]._id;

        // switch (subData[i].wear) {
        //     case '10':
        //         subData[i].wear = "Like New";
        //       break;
        //       case '8':
        //         subData[i].wear = "Good Condition";
        //       break;
        //       case '6':
        //         subData[i].wear = "Fair Condition";
        //       break;
        //       case'4':
        //       subData[i].wear = "Poor Condition";
        //       break;
        //       case '2':
        //         subData[i].wear = "Need Repair";
        //       break;
        //       case '0':
        //         subData[i].wear = "Sold As Component";
        //       break;
        //   }

        subData[i].itemDesc = subData[i].itemDesc.slice(0,30) + "...";

        postStatus = subData[i].tradeStatus;
        
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
        
        // offer management button
        mgmButton = document.createElement("button");
        mgmButtonId = "mgmButton" + i;
        mgmButton.setAttribute("id",mgmButtonId);
        mgmButton.className = "btn-small-accept";
        mgmButton.innerHTML = "Offer Management";
        myIdMgm = document.createAttribute("myid-mgm");
        myIdMgm.nodeValue = id;
        mgmButton.attributes.setNamedItem(myIdMgm);
        div3.appendChild(mgmButton);
        
        

        if(elementId=="ongoing"){

            boxId = "boxId" + i;
            ongoingBoxIds.push(boxId);
            div1.setAttribute("id",boxId);

            
            ongoingButtonIds.push(mgmButtonId);

            

            // edit post button
            editbutton = document.createElement("a");
            editbutton.className = "btn-small-accept";
            editbutton.innerHTML = "Edit";
            editbutton.href = '/offers/edit/'+id;
            div3.appendChild(editbutton);

            // delete post button
            deletebutton = document.createElement("button");
            deletebutton.className = "btn-small-accept";
            deletebutton.innerHTML = "Delete";

            if(postStatus == 1 || postStatus == 2){
                editbutton.className = "btn-small-banned";
                editbutton.setAttribute("disabled", "disabled");
                editbutton.innerHTML = "You cannot edit now";
                deletebutton.className = "btn-small-banned";
                deletebutton.setAttribute("disabled", "disabled");
                deletebutton.innerHTML = "You cannot delete now";
            }
            // deletebutton.onclick = function(){
            //     $.ajax({
            //         type: "delete",
            //         url: "/offers/offer/"+this.getAttribute("myid"),
            //         cache: false,
            //         async: false,
            //         success: function (data) {
            //             for(i=0;i<ongoingBoxIds.length;i++){
            //                 document.getElementById("ongoing").removeChild(document.getElementById(ongoingBoxIds[i]));
            //             }
            //             for(i=0;i<finishedBoxIds.length;i++){
            //                 document.getElementById("finished").removeChild(document.getElementById(finishedBoxIds[i]));
            //             }
            //             init();
            //         },
            //         error: function (data) {
                        
            //             errorBox = document.getElementById("errorBox");

            //             errorBox.removeAttribute("hidden");
            //             errorBox.setAttribute("display", true);
            //             errorBox.innerHTML = data.responseJSON.result;
            //             span = document.createElement("span");
            //             span.innerHTML = "×";
            //             span.className = "close";
            //             span.onclick = "this.parentElement.style.display='none';";
            //             errorBox.appendChild(span);
            //         }
            //     })
            // };
            
            
            myIdDelete = document.createAttribute("myid-delete");
            myIdDelete.nodeValue = id;
            deletebutton.attributes.setNamedItem(myIdDelete);

            // button.onclick = function(){
                
            //     $.ajax({
            //         type: "put",
            //         url: "/offers/status/confirmByBuyer/"+ this.getAttribute("myid"),
            //         cache: false,
            //         async: false,
            //         success: function (data) {
                        
            //             if(data.code == 200){
            //                 for(i=0;i<ongoingBoxIds.length;i++){
            //                 document.getElementById("ongoing").removeChild(document.getElementById(ongoingBoxIds[i]));
            //                 }
            //                 for(i=0;i<finishedBoxIds.length;i++){
            //                     document.getElementById("finished").removeChild(document.getElementById(finishedBoxIds[i]));
            //                 }
            //                 button.className = "btn-small-banned";
            //                 button.setAttribute("disabled", "disabled");
            //                 button.innerHTML = "You have confirmed";
            //                 init();
            //             }
            //         },
            //         error: function (data) {
                        
            //             errorBox = document.getElementById("errorBox");

            //             errorBox.removeAttribute("hidden");
            //             errorBox.setAttribute("display", true);
            //             errorBox.innerHTML = data.responseJSON.result;
            //             span = document.createElement("span");
            //             span.innerHTML = "×";
            //             span.className = "close";
            //             span.onclick = "this.parentElement.style.display='none';";
            //             errorBox.appendChild(span);
                        
            //         }
            //     })
            // };
            
            div3.appendChild(deletebutton);
        }else if (elementId=="finished"){
            boxId = "boxId" + i;
            finishedBoxIds.push(boxId);
            div1.setAttribute("id",boxId);
        }
    
        

        a = document.createElement("a");
        a.href = "/offers/post/"+id;
        a.className = "btn-small-accept";
        a.innerHTML = "Post Details";
        div3.appendChild(a);

        div4 = document.createElement("div");
        div4.className = "product-summary";
        div2.appendChild(div4);

        h4 = document.createElement("h4");
        h4.className = "productName";
        h4.innerHTML = subData[i].offerItem;
        div4.appendChild(h4);

        // wearDegree = document.createElement("p");
        // wearDegree.innerHTML = subData[i].wear;
        // div4.appendChild(wearDegree);

        p = document.createElement("p");
        p.innerHTML = subData[i].itemDesc;
        div4.appendChild(p);
    }
}