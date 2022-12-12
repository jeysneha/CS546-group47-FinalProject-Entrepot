module.exports = {


    checkCreateOffer(senderId, sellerId, postId, offerItem, itemDesc){
        if(arguments.length!=5){
            throw "Error: Offer input arguments are not complete"
        }
    
        if(typeof senderId!='string' ||typeof postId!='string' ||typeof offerItem!='string' ||
        typeof itemDesc!='string'){
            throw "Error: Wrong input type";
        }
    
        senderId = senderId.trim();
        postId = postId.trim();
        offerItem = offerItem.trim();
        itemDesc = itemDesc.trim();

    
        if(senderId.length === 0 || postId.length === 0  ||
        offerItem.length === 0 ||itemDesc.length === 0){
            throw "Error: null string"
        }

        if(offerItem.length >50){
            throw "Error: The title of offering item cannot exceed 50 characters.";
        }

        if(itemDesc.length >200){
            throw "Error: The description of offering item cannot exceed 200 characters.";
        }

        return {
            senderId: senderId,
            sellerId: sellerId,
            postId: postId,
            offerItem: offerItem,
            itemDesc: itemDesc
        }


    },


    checkEditOffer(offerItem, itemDesc, wear, originalOffer){
        // if(arguments.length!=2){
        //     throw "Error: Offer input arguments are not complete"
        // }
    
        if(typeof offerItem!='string' || typeof itemDesc!='string' || typeof wear != "string"){
            throw "Error: Wrong input type";
        }

        offerItem = offerItem.trim();
        itemDesc = itemDesc.trim();

    
        if(offerItem.length === 0 ||itemDesc.length === 0){
            throw "Error: null string"
        }

        if(offerItem.length >50){
            throw "Error: The title of offering item cannot exceed 50 characters.";
        }

        if(itemDesc.length >200){
            throw "Error: The description of offering item cannot exceed 200 characters.";
        }

        if(offerItem == originalOffer.offerItem && itemDesc == originalOffer.itemDesc && wear == originalOffer.wear) {
            throw "Error: The content are the same as original content.";
        }
        return {
            offerItem: offerItem,
            itemDesc: itemDesc,
            wear:wear
        }


    }
}