
(function () {

    let reviewRegisterForm = document.getElementById('reviewRegister-form');
    let titleInput = document.getElementById('reviewRegister-titleInput');
    let ratingInput = document.getElementById('reviewRegister-ratingInput');
    let descriptionInput = document.getElementById('reviewRegister-bodyInput');
    let reviewRegError = document.getElementById('reviewRegister-error');

    function validation(rating) {
        const ratingRegex = /^[1-5]$/;

        if (!ratingRegex.test(rating)) {
            return {
                hasError: true,
                error: 'Review rating must be an integer from 1 to 5 (1 is lowest, 5 is highest)!',
            }
        }

        return {
            hasError: false,
            error: null,
        }
    }

    if (reviewRegisterForm) {
        reviewRegisterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('start listening...');

            if (titleInput.value.trim() && ratingInput.value.trim() && descriptionInput.value.trim()) {

                let info = {
                    title: titleInput.value.trim(),
                    rating: ratingInput.value.trim(),
                    description: descriptionInput.value.trim(),
                }

                console.log('has all input...');
                console.log(typeof info.rating);
                reviewRegError.hidden = true;

                //check rating
                const validRes = validation(info.rating);

                if (!validRes.hasError) {
                    reviewRegError.hidden = true;
                    reviewRegisterForm.submit();
                }else {
                    console.log('invalid input');
                    titleInput.focus();
                    ratingInput.focus();
                    descriptionInput.focus();
                    reviewRegError.hidden = false;
                    reviewRegError.innerHTML = validRes.error;
                }
            }else{
                console.log('empty input');
                titleInput.focus();
                ratingInput.focus();
                descriptionInput.focus();
                reviewRegError.hidden = false;
                reviewRegError.innerHTML = "You must input title, rating, and description to create a review!"
            }
        })
    }

})()