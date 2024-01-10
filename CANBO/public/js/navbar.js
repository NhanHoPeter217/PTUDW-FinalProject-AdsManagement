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

    const picker = datepicker('#update_DOB', {
        formatter: (input, date, instance) => {
            const options = {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
            };
            const value = date.toLocaleDateString('en-GB', options);
            input.value = value; // '25/1/2099'
        },
        overlayPlaceholder: 'Nhập năm',
        customDays: ['S', 'M', 'T', 'W', 'Th', 'F', 'S']
    });

});

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('toggleOldPassword');
    const password = document.getElementById('oldPassword');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.querySelector('i').classList.toggle('bi-eye');
        this.querySelector('i').classList.toggle('bi-eye-slash');
    });

    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const newPassword = document.getElementById('newPassword');

    toggleNewPassword.addEventListener('click', function() {
        const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        newPassword.setAttribute('type', type);
        this.querySelector('i').classList.toggle('bi-eye');
        this.querySelector('i').classList.toggle('bi-eye-slash');
    });

    const toggleConfirmPassword = document.getElementById('toggleConfirmNewPassword');
    const confirmPassword = document.getElementById('confirmNewPassword');

    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        this.querySelector('i').classList.toggle('bi-eye');
        this.querySelector('i').classList.toggle('bi-eye-slash');
    });
});
