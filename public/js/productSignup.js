
(function () {

    let productSignupForm = document.getElementById('product-signup-form');
    let titleInput = document.getElementById('product-title');
    let bodyInput = document.getElementById('product-body');
    let categoryInput = document.getElementById('rproduct-Cate');
    let productImage = document.getElementById('product-image');





    if (productSignupForm) {
        productSignupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (titleInput.value.trim() && bodyInput.value.trim() && categoryInput.value.trim()) {

                let info = {
                    title: titleInput.value.trim(),
                    body: bodyInput.value.trim(),
                    category:  categoryInput.value.trim(),
                    image: productImage.value.trim(),
                }




                if (hasError) {
                    productSignupForm.submit();
                }else {
                    titleInput.focus();
                    bodyInput.focus();
                    categoryInput.focus();
                    productInfoError.hidden = false;
                    productInfoError.innerHTML = "You must input title, rating, and description to create a review!"

                }}
              }
        )
            }}
        )