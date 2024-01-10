$(document).ready(function () {
    // Get all district and ward for the dropdown list

    $('#register_role').on('change', function () {
        const selectedRole = $(this).val();

        if (selectedRole === 'Quận') {
            $('#registerWard').empty();
        } else {
            $('#registerWard').empty();
            $('#registerWard').append(`
                <label for="register_ward" class="form-label" style="font-family: Inter;">Phường</label>
                <select class="form-select wardType" id="register_ward" required>
                    <option class="mb-0 softer-text fw-nomral" selected disabled>-- Chọn Phường --</option>
                </select>
            `);
        }
    });

    fetch('/district/api/v1', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.json();
        })
        .then((district_data) => {
            if (!district_data) {
                return;
            }

            for (let i = 0; i < district_data.count; ++i) {
                $('.districtType').append(
                    `<option value="${district_data.districts[i].districtName}">${district_data.districts[i].districtName}</option>`
                );
            }

            if ($('.districtType').length > 0) {
                $('.districtType').on('change', function () {
                    var selectedDistrict = $(this).val();

                    let selectedDistrictData;
                    for (let i = 0; i < district_data.count; ++i) {
                        if (district_data.districts[i].districtName === `${selectedDistrict}`) {
                            selectedDistrictData = district_data.districts[i];
                            break;
                        }
                    }

                    if (selectedDistrictData) {
                        const wards = selectedDistrictData.wards;

                        $('.wardType').empty();
                        $('.wardType').append(
                            `<option class='mb-0 softer-text fw-nomral' selected disabled>-- Chọn Phường --</option>`
                        );

                        wards.forEach(function (ward) {
                            $('.wardType').append(`<option value="${ward}">${ward}</option>`);
                        });
                    } else {
                        console.log('Không tìm thấy quận!');
                    }
                });
            } else {
                console.log('.districtType not found!');
            }
        });
});

document.addEventListener('DOMContentLoaded', function () {
    const createAccountForm = document.querySelector('.createAccountForm');

    createAccountForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const fullName = document.getElementById('register_fullName').value;
        const userName = document.getElementById('register_userName').value;
        const password = document.getElementById('register_password').value;
        const confirmPassword = document.getElementById('register_confirmPassword').value;
        const dateOfBirth = document.getElementById('register_DOB').value;
        const email = document.getElementById('register_email').value;
        const phone = document.getElementById('register_phoneNumber').value;
        const role = document.getElementById('register_role').value;
        const district = document.getElementById('register_district').value;
        const ward = (role === "Phường") ? document.getElementById('register_ward').value : "*";

        let isValid = true;

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

        // Validate if passwords match
        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            isValid = false;
        }

        // Nếu có lỗi, ngăn chặn việc gửi form
        if (!isValid) {
            event.preventDefault();
        }

        const registrationData = {
            username: userName,
            password: password,
            fullName: fullName,
            dateOfBirth: dateOfBirth,
            email: email,
            phone: phone,
            role: role,
            assignedArea: {
                ward: ward,
                district: district
            }
        };

        // Prepare JSON data
        const jsonData = JSON.stringify(registrationData);

        // Send PATCH request to update user info
        fetch('/auth/register/api/v1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then((response) => {
                if (response.ok) {
                    alert('Đăng ký tài khoản thành công!');
                    window.location.reload();
                } else {
                    alert('Đăng ký thất bại. Vui lòng thử lại.');
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
