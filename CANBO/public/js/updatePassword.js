document.addEventListener('DOMContentLoaded', function () {
    const updatePassword = document.querySelector('.updatePasswordForm');

    updatePassword.addEventListener('submit', function (event) {
        event.preventDefault();
        const currentPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        // Validate if passwords match
        if (newPassword !== confirmNewPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        // Prepare JSON data
        const jsonData = JSON.stringify({
            currentPassword,
            newPassword
        });

        // Send PATCH request to update password
        fetch('/api/v1/user/updatepassword', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then((response) => {
                if (response.ok) {
                    alert('Cập nhật thành công!');
                    window.location.reload();
                } else {
                    alert('Cập nhật thất bại. Vui lòng thử lại.');
                }
            })
            .catch((error) => {
                console.error('Lỗi:', error);
            });
    });
});
