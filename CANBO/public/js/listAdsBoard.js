document.addEventListener('DOMContentLoaded', function () {
    const picker3 = datepicker('#license_contractEndDate', {
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
    const picker4 = datepicker('#license_contractStartDate', {
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
    const inputs = $('.edit_contractEndDate');
    for (let i = 0; i < inputs.length; ++i) {
        initializeDatepicker(`#` + inputs[i].getAttribute('id'));
    }
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
        if (!district_data) { return; }
        if ($('.districtType').length > 0) {
            $('.districtType').on('change', function() {
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
                    $('.wardType').append(`<option class='mb-0 softer-text fw-nomral' selected disabled>-- Chọn Phường --</option>`);

                    wards.forEach(function(ward) {
                        $('.wardType').append(`<option value="${ward}">${ward}</option>`);
                    });
                } else {
                    console.log('District not found!');
                }
            });
        } else {
            console.log('.districtType not found!');
        }
    });
    function initializeDatepicker(inputId) {
        const picker = datepicker(inputId, {
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
    }
});