

(function() {
    let updateForm = document.getElementById('userUpdate-form');
    let usernameInput = document.getElementById('userUpdate-usernameInput');
    let emailInput = document.getElementById('userUpdate-emailInput');
    let originPassword = document.getElementById('originPasswordInput');
    let newPassword = document.getElementById('newPasswordInput');
    let updateError = document.getElementById('userUpdate-error')

    function validation(info) {
        //username check
        if (info.username.length < 4) {
            return {
                hasError: true,
                error: 'Username must contain at least 4 characters!',
            };
        }
        const spaceRegex = /\s/;
        if (spaceRegex.test(info.username)) {
            return {
                hasError: true,
                error: 'Username must not contain space!',
            }
        }
        info.username = info.username.toLowerCase();
        const alphanumericRegex = /^\w+$/;
        if (!alphanumericRegex.test(info.username)) {
            return {
                hasError: true,
                error: 'Username must contain letters and numbers only!',
            }
        }

        //email check
        info.email = info.email.toLowerCase();
        if (spaceRegex.test(info.email)) {
            return {
                hasError: true,
                error: 'Email must not contain space!',
            }
        }

        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
        if (!emailRegex.test(info.email)) {
            return {
                hasError: true,
                error: 'Invalid email!',
            }
        }

        // old password check
        if (info.oldPassword.length < 6) {
            return {
                hasError: true,
                error: 'Password must contain at least 6 characters!',
            }
        }
        if (spaceRegex.test(info.oldPassword)) {
            return {
                hasError: true,
                error: 'Password must not contain space!'
            }
        }
        const requireRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/;
        if (!requireRegex.test(info.oldPassword)) {
            return {
                hasError: true,
                error: 'Password must contain at least 1 uppercase character, at least 1 lowercase character, at least 1 number, at least 1 special character!',
            }
        }

        // new password check
        if (info.newPassword.length < 6) {
            return {
                hasError: true,
                error: 'Password must contain at least 6 characters!',
            }
        }
        if (spaceRegex.test(info.newPassword)) {
            return {
                hasError: true,
                error: 'Password must not contain space!'
            }
        }
        if (!requireRegex.test(info.newPassword)) {
            return {
                hasError: true,
                error: 'Password must contain at least 1 uppercase character, at least 1 lowercase character, at least 1 number, at least 1 special character!',
            }
        }

        // no errors
        return {
            hasError: false,
            error: null,
        }
    }

    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            console.log('Start listening');
            event.preventDefault();

            if (usernameInput.value.trim() && emailInput.value.trim()
                && originPassword.value.trim() && newPassword.value.trim()) {

                let info = {
                    username: usernameInput.value.trim(),
                    email: emailInput.value.trim(),
                    oldPassword: originPassword.value.trim(),
                    newPassword: newPassword.value.trim(),
                }

                console.log('has all input values...');
                updateError.hidden = true;

                //validation check
                const validResult = validation(info);

                if (!validResult.hasError) {
                    updateError.hidden = true;
                    updateForm.submit();
                }else {
                    console.log('invalid input')
                    usernameInput.focus();
                    emailInput.focus();
                    originPassword.focus();
                    newPassword.focus();
                    updateError.hidden = false;
                    updateError.innerHTML = validResult.error;
                }
            }else {
                console.log('empty input')
                usernameInput.focus();
                emailInput.focus();
                originPassword.focus();
                newPassword.focus();
                updateError.hidden = false;
                updateError.innerHTML = 'You must enter username, E-mail, origin password, and new password!';
            }

        })
    }
})()