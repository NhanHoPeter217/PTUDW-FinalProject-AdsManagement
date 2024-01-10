document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/v1/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((infoUser_data) => {
        if (!infoUser_data) {
            return
        }

        $('#username').text(infoUser_data.infoUser.username);
    });

    document.getElementById('logoutButton').addEventListener('click', function() {

        fetch('/auth/logout/api/v1', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => {
            console.log(response);
            window.location.href = '/auth/login';
        })
        .catch(error => {
            console.error('Lỗi khi đăng xuất:', error);
        });
    });
});
