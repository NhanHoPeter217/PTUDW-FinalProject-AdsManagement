$(document).ready(function () {
    // Get all district and ward for the dropdown list

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

            $('.account_edit_district').empty();

            for (let i = 0; i < district_data.count; ++i) {
                $('.account_edit_district').append(
                    `<option value="${district_data.districts[i].districtName}">${district_data.districts[i].districtName}</option>`
                );
            }

            if ($('.account_edit_district').length > 0) {
                $('.account_edit_district').on('change', function () {
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

                        $('.account_edit_ward').empty();
                        $('.account_edit_ward').append(
                            `<option class='mb-0 softer-text fw-nomral' disabled>-- Chọn Phường --</option>`
                        );

                        wards.forEach(function (ward) {
                            $('.account_edit_ward').append(`<option value="${ward}">${ward}</option>`);
                        });
                    } else {
                        console.log('Không tìm thấy quận!');
                    }
                });
            } else {
                console.log('.account_edit_district not found!');
            }
        });
});

$(document).ready(function () {
    // const createAccountForm = $('.account_editForm');

    $('.account_editForm').on('submit', async function (e) {
        console.log(1);
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        let role = document.getElementById(`account_edit_role-${id}`).value;
        let district = document.getElementById(`account_edit_district-${id}`).value;
        let ward = document.getElementById(`account_edit_ward-${id}`).value;

        if (role === 'Quận') {
            ward = '*';
        }

        const accountData = {
            role: role,
            district: district,
            ward: ward
        };
        console.log(accountData);

        // Prepare JSON data
        const jsonData = JSON.stringify(accountData);

        // Send PATCH request to update user info
        fetch(`/auth/editAccount/api/v1/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        })
            .then((response) => {
                if (response.ok) {
                    alert('Cập nhật tài khoản thành công!');
                    window.location.reload();
                } else {
                    alert('Cập nhật thất bại.');
                }
            })
            .catch((error) => {
                console.error('Lỗi:', error);
            });
    });

});