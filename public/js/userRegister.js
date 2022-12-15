
(function() {
    let registerForm = document.getElementById('registration-form');
    let usernameInput = document.getElementById('register-usernameInput');
    let emailInput = document.getElementById('register-emailInput');
    let passwordInput = document.getElementById('register-passwordInput');
    let registerError = document.getElementById('signup-error');

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

        //password check
        if (info.password.length < 6) {
            return {
                hasError: true,
                error: 'Password must contain at least 6 characters!',
            }
        }
        if (spaceRegex.test(info.password)) {
            return {
                hasError: true,
                error: 'Password must not contain space!'
            }
        }
        const requireRegex = /(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W)/;
        if (!requireRegex.test(info.password)) {
            return {
                hasError: true,
                error: 'Password must contain at least 1 uppercase character, at least 1 lowercase character, at least 1 number, at least 1 special character!',
            }
        }

        return {
            hasError: false,
            error: null,
        }
    }

    //form event listening
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            console.log('start listening');
            event.preventDefault();

            if (usernameInput.value.trim() && emailInput.value.trim() && passwordInput.value.trim()) {
                let info = {
                    username: usernameInput.value.trim(),
                    email: emailInput.value.trim(),
                    password: passwordInput.value.trim(),
                }

                console.log('has all sign-up inputs...');
                registerError.hidden = true;

                //validation check
                const validResult = validation(info);

                if (!validResult.hasError) {
                    registerError.hidden = true;
                    registerForm.submit();
                }else {
                    console.log('invalid input')
                    usernameInput.focus();
                    passwordInput.focus();
                    registerError.hidden = false;
                    registerError.innerHTML = validResult.error;
                }

            }else {
                console.log('empty')
                usernameInput.focus();
                passwordInput.focus();
                registerError.hidden = false;
                registerError.innerHTML = 'You must enter username, E-mail and password!';
            }
        })
    }
})()
