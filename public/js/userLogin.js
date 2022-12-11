

(function() {
    let loginForm = document.getElementById('login-form');
    let usernameInput = document.getElementById('login-usernameInput');
    let passwordInput = document.getElementById('login-passwordInput');
    let loginError = document.getElementById('login-error');

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

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            console.log('Start listening');
            event.preventDefault();

            if (usernameInput.value.trim() && passwordInput.value.trim()) {
                let info = {
                    username: usernameInput.value.trim(),
                    password: passwordInput.value.trim(),
                }

                console.log('has both login input...');
                loginError.hidden = true;

                //check validation
                const validResult = validation(info);
                if (!validResult.hasError) {
                    loginError.hidden = true;
                    // loginError.removeAttribute("hidden");
                    loginForm.submit();
                }else {
                    console.log('invalid input');
                    usernameInput.focus();
                    passwordInput.focus();
                    loginError.hidden = false;
                    loginError.innerHTML = validResult.error;
                }
            }else {
                console.log('empty')
                usernameInput.focus();
                passwordInput.focus();
                loginError.hidden = false;
                loginError.innerHTML = 'You must enter both username and password!';
            }
        })
    }
})();


