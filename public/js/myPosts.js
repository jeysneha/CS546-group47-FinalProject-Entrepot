
let data;

let ongoingButtonIds = [];
let finishedButtonIds = [];

let ongoingBoxIds = [];
let freezedBoxIds = [];
let finishedBoxIds = [];
let boughtBoxIds = [];

let ongoingPosts;
let freezedPosts;
let finishedPosts;
let boughtPosts;

init();

function init() {

    document.getElementById("errorBox").hidden = true;
    // document.getElementById("errorBox").setAttribute("hidden", true);

    ongoingButtonIds = [];
    finishedButtonIds = [];

    ongoingBoxIds = [];
    freezedBoxIds = [];
    finishedBoxIds = [];
    boughtBoxIds = [];

    otherOffersAcceptButtonId = [];
    otherOffersBoxId = [];
    // get all the offer of a ceratin post
    data = getAll();
    //console.log(data);
    
    ongoingPosts = data.zeroStatusPost;
    freezedPosts = data.oneStatusPost;
    finishedPosts = data.twoStatusPost;
    boughtPosts = data.boughtPosts;
    console.log(boughtPosts);
    // show the offers list
    bindList("ongoing");
    bindList("freezed");
    bindList("finished");
    bindList("bought");

}


function getAll() {
    let result;
    $.ajax({
        methods: "get",
        // url:'/offers/mySent/'+userId,
        url:'/user/deal',
        cache: false,
        async: false,
        success: function (data) {
        result = data},
        error: function(data) {
            result = data
        }
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
        subData = ongoingPosts;
    }else if(elementId == "freezed"){
        subData = freezedPosts;
    }else if(elementId == "finished"){
        subData = finishedPosts;
    }else if(elementId == "bought"){
        subData = boughtPosts;
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

        subData[i].itemDesc = subData[i].body.slice(0,30) + "...";

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


        imgName = subData[i].imgFile;
        img = document.createElement("img");
        img.src = "/posts/images/"+imgName;
        img.alt=subData[i].offerItem;
        figure.appendChild(img);

        div3 = document.createElement("div");
        div3.className = "product-over";
        figure.appendChild(div3);
        
        // offer management button
        
        
        

        if(elementId=="ongoing"){

            mgmButton = document.createElement("a");
            mgmButtonId = elementId+"mgmButton" + i;
            mgmButton.setAttribute("id",mgmButtonId);
            mgmButton.className = "btn-small-accept";
            mgmButton.innerHTML = "Offer Management";
            mgmButton.href = "/offers/offersOf/" + id;
            mgmButton.setAttribute("data-myIdMgm", id)
            div3.appendChild(mgmButton);

            boxId = elementId+"boxId" + i;
            ongoingBoxIds.push(boxId);
            div1.setAttribute("id",boxId);

            
            ongoingButtonIds.push(mgmButtonId);

            

            // edit post button
            editbutton = document.createElement("a");
            editbutton.className = "btn-small-accept";
            editbutton.innerHTML = "Edit";
            editbutton.href = '/posts/edit/'+id;
            div3.appendChild(editbutton);

            // delete post button
            deletebutton = document.createElement("button");
            deletebutton.className = "btn-small-accept";
            deletebutton.innerHTML = "Delete";
            deletebutton.setAttribute("data-myid",id);
            // myId = document.createAttribute("myid");
            // myId = document.
            // myId.nodeValue = id;
            // deletebutton.attributes.setNamedItem(myId);

            // if(postStatus == 1 || postStatus == 2){
            //     editbutton.className = "btn-small-banned";
            //     editbutton.setAttribute("disabled", "disabled");
            //     editbutton.innerHTML = "You cannot edit now";
            //     deletebutton.className = "btn-small-banned";
            //     deletebutton.setAttribute("disabled", "disabled");
            //     deletebutton.innerHTML = "You cannot delete now";
            // }
            deletebutton.onclick = function(){
                const ans = window.confirm("Are your sure to delete the post?");
                if(ans){
                    $.ajax({
                    type: "delete",
                    url: "/posts/"+this.getAttribute("data-myid"),
                    cache: false,
                    async: false,
                    success: function (data) {
                        for(i=0;i<ongoingBoxIds.length;i++){
                            document.getElementById("ongoing").removeChild(document.getElementById(ongoingBoxIds[i]));
                        }
                        for(i=0;i<freezedBoxIds.length;i++){
                            document.getElementById("freezed").removeChild(document.getElementById(freezedBoxIds[i]));
                        }
                        for(i=0;i<finishedBoxIds.length;i++){
                            document.getElementById("finished").removeChild(document.getElementById(finishedBoxIds[i]));
                        }
                        for(i=0;i<boughtBoxIds.length;i++){
                            document.getElementById("bought").removeChild(document.getElementById(boughtBoxIds[i]));
                        }
                        init();
                        errorBox = document.getElementById("errorBox");
                        errorBox.hidden = false;
                        errorBox.display = true;
                        errorBox.className = "successMessage";
                        errorBox.innerHTML = "You have successfully deleted the post item!";
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
                        span.onclick = function closeWarningBox() {
                            document.getElementById("errorBox").display = false;
                            document.getElementById("errorBox").hidden = true;
                          };
                        errorBox.appendChild(span);
                    }
                });
                }else{
                    return;
                }
            }
            
            // myIdDelete = document.createAttribute("myid-delete");
            // myIdDelete.nodeValue = id;
            // deletebutton.attributes.setNamedItem(myIdDelete);

            
            
            div3.appendChild(deletebutton);
        
        }else if (elementId=="freezed"){

            mgmButton = document.createElement("a");
            mgmButtonId = elementId+"mgmButton" + i;
            mgmButton.setAttribute("id",mgmButtonId);
            mgmButton.className = "btn-small-accept";
            mgmButton.innerHTML = "Offer Management";
            mgmButton.href = "/offers/offersOf/" + id;

            mgmButton.setAttribute("data-myIdMgm", id)
            // myIdMgm = document.createAttribute("myid-mgm");
            // myIdMgm.nodeValue = id;
            // mgmButton.attributes.setNamedItem(myIdMgm);
            div3.appendChild(mgmButton);

            boxId = elementId+"boxId" + i;
            freezedBoxIds.push(boxId);
            div1.setAttribute("id",boxId);
        }
        else if (elementId=="finished"){
            mgmButton = document.createElement("a");
            mgmButtonId = elementId+"mgmButton" + i;
            mgmButton.setAttribute("id",mgmButtonId);
            mgmButton.className = "btn-small-accept";
            mgmButton.innerHTML = "Offer Management";
            mgmButton.href = "/offers/offersOf/" + id;
            mgmButton.setAttribute("data-myIdMgm", id)
            div3.appendChild(mgmButton);

            boxId = elementId+"boxId" + i;
            finishedBoxIds.push(boxId);
            div1.setAttribute("id",boxId);
        }else if (elementId=="bought"){
            boxId = elementId+"boxId" + i;
            boughtBoxIds.push(boxId);
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

        h4 = document.createElement("h1");
        h4.className = "productName";
        h4.innerHTML = subData[i].title;
        div4.appendChild(h4);

        // wearDegree = document.createElement("p");
        // wearDegree.innerHTML = subData[i].wear;
        // div4.appendChild(wearDegree);

        p = document.createElement("p");
        p.innerHTML = subData[i].itemDesc;
        div4.appendChild(p);
    }
}