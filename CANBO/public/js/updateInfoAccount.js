document.addEventListener('DOMContentLoaded', function () {
    const updateInfoForm = document.querySelector('.updateInfoForm');

    fetchUserInfo('update_fullName', 'update_DOB', 'update_email', 'update_phoneNumber');

    updateInfoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const fullName = document.getElementById('update_fullName').value;
        const dateOfBirth = document.getElementById('update_DOB').value;
        const email = document.getElementById('update_email').value;
        const phone = document.getElementById('update_phoneNumber').value;

        let isValid = true;

        console.log(fullName);

        // Kiểm tra tên
        if (!fullName.trim()) {
            console.log('Hãy nhập tên của bạn!');
            alert('Hãy nhập tên của bạn!');
            isValid = false;
        }

        // Kiểm tra email
        if (!validateEmail(email) || !email.trim()) {
            console.log('Hãy nhập cấu trúc email hợp lệ!');
            alert('Hãy nhập cấu trúc email hợp lệ!');
            isValid = false;
        }

        // Nếu có lỗi, ngăn chặn việc gửi form
        if (!isValid) {
            event.preventDefault();
        }

        // Prepare JSON data
        const jsonData = JSON.stringify({
            fullName,
            dateOfBirth,
            email,
            phone
        });

        // Send PATCH request to update user info
        fetch('/api/v1/user/updateUserInformation', {
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

    function validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
});
