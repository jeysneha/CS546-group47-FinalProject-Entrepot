


let logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', function() {
    console.log('starting listening logout button...')
    const ans = window.confirm("You are going to log out, are your sure to log out?");

    if (ans) {
        console.log('get yes')
        $.ajax({
            method: "GET",
            url: '/logout',
            cache: false,
            contentType: false,
            processData: false,
        })
        document.location.reload();
        console.log('logout successfully')
    }else {
        console.log('get cancelled')
    }
})