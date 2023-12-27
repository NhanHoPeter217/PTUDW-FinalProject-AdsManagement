$(function () {
    let datePicker = document.getElementById('dateOfBirth');
    let picker = new Litepicker({
        element: datePicker,
        format: 'DD/MM/YYYY'
    });
});

function openUpdateModal() {
    $('#updateModal').modal('show');
}

function openChangePasswordModal() {
    $('#changePasswordModal').modal('show');
}

const fetchUserInfo = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/v1/updateInfo', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        const data = await response.json();

        // Fill form fields with user info
        document.getElementById('fullName').value = data.infoUser.fullName || '';
        document.getElementById('dateOfBirth').value = data.infoUser.dateOfBirth || '';
        document.getElementById('email').value = data.infoUser.email || '';
        document.getElementById('phone').value = data.infoUser.phone || '';
    } catch (error) {
        console.error('Error fetching user info:', error.message);
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const updateForm = document.querySelector('.update-form');
    const changePasswordForm = document.querySelector('.change-password-form');

    fetchUserInfo();

    updateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        let isValid = true;

        // Kiểm tra tên
        if (!fullName.value.trim()) {
            showError('name', 'Please fill out your name');
            isValid = false;
        } else {
            hideError('name');
        }

        // Kiểm tra email
        if (!validateEmail(email.value) || !email.value.trim()) {
            showError('email', 'Please fill out a valid email format');
            isValid = false;
        } else {
            hideError('email');
        }

        // Nếu có lỗi, ngăn chặn việc gửi form
        if (!isValid) {
            event.preventDefault();
        } else {
            alert('Thank you for your information!');
        }

        // Prepare JSON data
        const jsonData = JSON.stringify({
            fullName,
            dateOfBirth,
            email,
            phone
        });

        // Send PATCH request to update user info
        fetch('http://localhost:3000/api/v1/updateinfo', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then((response) => {
                if (response.ok) {
                    alert('Update successful!');
                    // You can perform additional actions or redirect here
                } else {
                    alert('Update failed. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    changePasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        // Validate if passwords match
        if (newPassword !== confirmNewPassword) {
            alert('Passwords do not match');
            return;
        }

        // Prepare JSON data
        const jsonData = JSON.stringify({
            currentPassword,
            newPassword
        });

        // Send PATCH request to update password
        fetch('http://localhost:3000/api/v1/updatepw', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then((response) => {
                if (response.ok) {
                    alert('Password update successful!');
                    // You can perform additional actions or redirect here
                } else {
                    alert('Password update failed. Please try again.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });

    const dateOfBirthInput = document.getElementById('dateOfBirth');

    dateOfBirthInput.addEventListener('input', function (event) {
        let inputValue = event.target.value;

        // Remove non-numeric characters
        inputValue = inputValue.replace(/\D/g, '');

        // Format the date as dd/mm/yyyy
        if (inputValue.length >= 2) {
            inputValue = inputValue.substring(0, 2) + '/' + inputValue.substring(2);
        }
        if (inputValue.length >= 5) {
            inputValue = inputValue.substring(0, 5) + '/' + inputValue.substring(5, 9);
        }
        event.target.value = inputValue;
    });

    const inputFields = document.querySelectorAll('.form-control');

    inputFields.forEach(function (input) {
        input.addEventListener('input', function () {
            if (input.value.trim() !== '') {
                input.classList.add('has-value');
            } else {
                input.classList.remove('has-value');
            }
        });
    });

    function showError(inputId, errorMessage = 'required') {
        const errorSpan = document.getElementById(`${inputId}-error`);
        errorSpan.textContent = errorMessage;
        errorSpan.style.visibility = 'visible';
    }

    function hideError(inputId) {
        const errorSpan = document.getElementById(`${inputId}-error`);
        errorSpan.textContent = '';
        errorSpan.style.visibility = 'hidden';
    }

    function validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
});
