


var postId = "67891012aed";

function getAll() {
    var result;
    $.ajax({
    methods: "get",
    url:'/offers/'+postId,
    cache: false,
    async: false,
    success: function (data) {
    result = data}
    
})
return result;
}
var exchg = "../public/offerUploads/exchg.png";
var data;
var otherOffersAcceptButtonId = [];
var acceptedOfferId;
var otherOffersBoxId = [];

init();

function init() {
    otherOffersAcceptButtonId = [];
    otherOffersBoxId = [];
    // get all the offer of a ceratin post
    data = getAll().result;
    // show the current accepted offer
    
    // show the offers list
    bindList();
    currentAccept();
    // console.log(otherOffersBoxId);
}

function getImage(tagName,imgName){
    document.getElementById(tagName).src = "images/"+imgName;
}

function currentAccept(){

    find = ifAccept();
    if(find.find == true){
        flag = true;
        acceptedOfferId = find.result._id;
    }else{
        flag = false;
    }
    if(data.length != 0){
        document.getElementById("cancelAcceptButton").className = "btn-accept";
        document.getElementById("confirmButton").className = "btn-confirm";
    }
    else{
        document.getElementById("cancelAcceptButton").className = "btn-banned";
        document.getElementById("confirmButton").className = "btn-banned";
        $("#confirmButton").attr("disabled","disabled");
        $("#cancelAcceptButton").attr("disabled","disabled");
    }

    acceptedOffer = find.result;

    offerImg = document.getElementById("offer-item");
    myImg = document.getElementById("my-item");

    // 👇这里要改
    myImg.src = "images/"+data[0].imgName;

    exchgImg = document.getElementById("exchg-sign");
    exchgImg.src = exchg;

    offerStatus = document.getElementById("offerStatus");
    offerItem = document.getElementById("offerItem");
    if(flag){
        
        for(let i=0;i<otherOffersAcceptButtonId.length;i++){
            document.getElementById(otherOffersAcceptButtonId[i]).className = "btn-small-banned";
            $("#"+otherOffersAcceptButtonId[i]).attr("disabled","disabled")
        }

        if(acceptedOffer != null){
            offerImg.src = "images/"+acceptedOffer.imgName;
        }else{
            offerImg.src = "";
        }
        
        
        offerItem.innerHTML = acceptedOffer.offerItem;

        if(acceptedOffer.confirmByPoster == 1 && acceptedOffer.confirmByBuyer == 0){
            document.getElementById("cancelAcceptButton").className = "btn-banned";
            $("#cancelAcceptButton").attr("disabled","disabled");
            document.getElementById("confirmButton").className = "btn-banned";
            $("#confirmButton").attr("disabled","disabled");
            offerStatus.innerHTML = "You confirmed";
        }else if (acceptedOffer.confirmByPoster == 0 && acceptedOffer.confirmByBuyer == 1){
            document.getElementById("cancelAcceptButton").className = "btn-banned";
            offerStatus.innerHTML = "Your counterparty confirmed";
        }else if (acceptedOffer.confirmByPoster == 1 && acceptedOffer.confirmByBuyer == 1){
            document.getElementById("cancelAcceptButton").className = "btn-banned";
            document.getElementById("confirmButton").className = "btn-banned";
            offerStatus.innerHTML = "Deal Made";
        }else if (acceptedOffer.confirmByPoster == 0 && acceptedOffer.confirmByBuyer == 0){
            offerStatus.innerHTML = "Offer Accepted";
        }

    }else{
        document.getElementById("cancelAcceptButton").className = "btn-banned";
        document.getElementById("confirmButton").className = "btn-banned";
        offerImg.src = "../public/offerUploads/no.png";
        offerStatus.innerHTML = "None";
        offerItem.innerHTML = "None";
    }
}

function bindList(){

    var products = document.getElementById('products'); //找到tbody标签
    
    
    for (var i = 0; i < data.length; i++) { //对stus进行循环遍历，并建立tr标签
        id = data[i]._id;
        var div1 = document.createElement('div');

        boxId = "boxId" + i;
        otherOffersBoxId.push(boxId);
        div1.setAttribute("id",boxId);
        div1.className = "product";
        products.appendChild(div1);
        var div2 = document.createElement('div');
        div2.className = "product-under";
        div1.appendChild(div2);

        figure = document.createElement("figure");
        figure.className = "product-image";
        div2.appendChild(figure);


        imgName = data[i].imgName;
        img = document.createElement("img");
        img.src = "images/"+imgName;
        img.alt=data[i].offerItem;
        figure.appendChild(img);

        div3 = document.createElement("div");
        div3.className = "product-over";
        figure.appendChild(div3);

        acceptButtonId = "acceptButton" + i;
        otherOffersAcceptButtonId.push(acceptButtonId);
        button = document.createElement("button");
        // button.id = acceptButtonId;
        button.setAttribute("id",acceptButtonId);
        button.className = "btn-small-accept";
        button.innerHTML = "Accept";

        myId = document.createAttribute("myid");
        myId.nodeValue = id;
        button.attributes.setNamedItem(myId);

        button.onclick = function(){
            // alert(this.getAttribute("id"));
            $.ajax({
                type: "put",
                url:'/offers/status/accept/'+this.getAttribute("myid"),
                cache: false,
                async: false,
                data: {
                    "newAcceptStatus" : 1
                },
                success: function (data) {
                    for(i=0;i<otherOffersBoxId.length;i++){
                        document.getElementById("products").removeChild(document.getElementById(otherOffersBoxId[i]));
                    }
                    init();
                }
            })
        };
        div3.appendChild(button);

        a = document.createElement("a");
        a.href = "/offers/offer/"+id;
        a.className = "btn-small-accept";
        a.innerHTML = "Offer Details";
        div3.appendChild(a);

        div4 = document.createElement("div");
        div4.className = "product-summary";
        div2.appendChild(div4);

        h4 = document.createElement("h4");
        h4.className = "productName";
        h4.innerHTML = data[i].offerItem;
        div4.appendChild(h4);

        span = document.createElement("span");
        span.className = "stars";
        div4.appendChild(span);

        p = document.createElement("p");
        p.innerHTML = data[i].itemDesc;
        div4.appendChild(p);
    }
}

function ifAccept() {
    var isAccept;
    for(i=0;i<data.length;i++) {
        if(data[i].acceptStatus == 1) {
            isAccept = true;
            acceptedOffer = data[i];
            break;
        }
    }

    if(isAccept == true) {
        return {find:true, result:acceptedOffer};
    }
    return {find:false, result:null};
}

$('#cancelAcceptButton').click((event) => {
    event.preventDefault();
    
    $.ajax({
        type: "put",
        url:'/offers/status/accept/'+acceptedOfferId,
        cache: false,
        async: false,
        data: {
            "newAcceptStatus" : 0
        },
        success: function (data) {
            for(i=0;i<otherOffersBoxId.length;i++){
                document.getElementById("products").removeChild(document.getElementById(otherOffersBoxId[i]));
            }
            init()        
        }
    })
})

$('#confirmButton').click((event) => {
    event.preventDefault();
    
    $.ajax({
        type: "put",
        url:'/offers/status/confirmBySeller/'+acceptedOfferId,
        cache: false,
        async: false,
        success: function (data) {
            for(i=0;i<otherOffersBoxId.length;i++){
                document.getElementById("products").removeChild(document.getElementById(otherOffersBoxId[i]));
            }
            init();
        }
    })
})