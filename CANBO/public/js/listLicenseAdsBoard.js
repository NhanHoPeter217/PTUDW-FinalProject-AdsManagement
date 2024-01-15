import initMapViewOnly from './miniMap_viewonly.js';

function updateCheckbox() {
    // Get all the checkbox elements
    const checkboxes = document.querySelectorAll('.checkbox-input');
    const wardList = [];

    function fetchAdsPointsByWardList(district) {
        const checkboxes = document.querySelectorAll('.checkbox-input');
        wardList.length = 0; // Clear the wardList array

        Array.from(checkboxes).forEach(function (checkbox) {
            if (checkbox.checked) {
                wardList.push(checkbox.id);
            }
        });

        console.log(wardList);

        fetch('/adsLicenseRequest/assignedArea', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                district: district,
                wardList: wardList
            })
        })
            .then((response) => {
                return response.json();
            })
            .then((adsLicenseRequest_data) => {
                $('#body').empty();

                if (!adsLicenseRequest_data) {
                    return;
                }

                const adsLicenseRequests = adsLicenseRequest_data.allAdsLicense;

                var index = 0;

                adsLicenseRequests.forEach(function (adsLicenseRequest) {
                    index += 1;
                    if (adsLicenseRequest.requestApprovalStatus === 'Đã được duyệt') {
                        $('#body').append(`
                            <tr>
                                <td class="border-bottom-0 text-center align-middle">
                                    <h6 class="fw-semibold mb-0">${index}</h6>
                                </td>
                                <td class="border-bottom-0 text-center align-middle fw-semibold">
                                    ${adsLicenseRequest.licenseRequestedAdsBoard.adsBoardType}
                                </td>
                                <td class="border-bottom-0 text-center align-middle fw-semibold">
                                    ${adsLicenseRequest.licenseRequestedAdsBoard.adsBoard.adsPoint.location.locationName}
                                </td>
                                <td class="border-bottom-0 text-center align-middle">
                                    <div class="d-flex align-items-center justify-content-center" style="height: 100%;">
                                        <span class="badge bg-success rounded-3 fw-semibold">Đã được duyệt</span>
                                    </div>
                                </td>
                                <td class="border-bottom-0 align-middle">
                                    <button
                                        type="button"
                                        class="btn btn-warning m-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#detailLicenseAdsBoardModal-${adsLicenseRequest._id}">
                                        <div class="d-flex">
                                        <img src="../../../public/assets/icons/Verify_icon.svg" alt="" width="24" height="24" class="me-2" />
                                        <div style="color: white">Chi tiết</div>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        `);
                    } else {
                        $('#body').append(`
                            <tr>
                                <td class="border-bottom-0 text-center align-middle">
                                    <h6 class="fw-semibold mb-0">${index}</h6>
                                </td>
                                <td class="border-bottom-0 text-center align-middle fw-semibold">
                                    ${adsLicenseRequest.licenseRequestedAdsBoard.adsBoardType}
                                </td>
                                <td class="border-bottom-0 text-center align-middle fw-semibold">
                                    ${adsLicenseRequest.licenseRequestedAdsBoard.adsBoard.adsPoint.location.locationName}
                                </td>
                                <td class="border-bottom-0 text-center align-middle">
                                    <div class="d-flex align-items-center justify-content-center" style="height: 100%;">
                                        <span class="badge bg-warning rounded-3 fw-semibold">Chưa được duyệt</span>
                                    </div>
                                </td>
                                <td class="border-bottom-0 align-middle">
                                    <button
                                        type="button"
                                        class="btn btn-warning m-1"
                                        data-bs-toggle="modal"
                                        data-bs-target="#detailLicenseAdsBoardModal-${adsLicenseRequest._id}">
                                        <div class="d-flex">
                                        <img src="../../../public/assets/icons/Verify_icon.svg" alt="" width="24" height="24" class="me-2" />
                                        <div style="color: white">Chi tiết</div>
                                        </div>
                                    </button>
                                </td>
                            </tr>
                        `);
                    }
                });
            });
    }

    // Add event listeners to each checkbox
    checkboxes.forEach(function (checkbox) {
        const currentDistrict = $('#license_filter_district').val();
        console.log(currentDistrict);
        checkbox.addEventListener('change', function () {
            fetchAdsPointsByWardList(currentDistrict);
        });
    });
}

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

            if ($('#license_filter_district').length > 0) {
                const districts = district_data.districts;
                const currentDistrict = $('#license_filter_district').val();
                console.log(currentDistrict);
                const currentDistrictData = districts.find(
                    (district) => district.districtName === currentDistrict
                );
                var wards = [];
                if (currentDistrictData) {
                    wards = currentDistrictData.wards;
                    $('#license_filter_ward').empty();

                    wards.forEach(function (ward) {
                        $('#license_filter_ward').append(`
                        <div class="list-group-item d-flex list-group-item-action justify-content-between align-items-center">
                            <label class="checkbox-container">
                                <input type="checkbox" class="checkbox-input" id="${ward}">
                                <span>Phường ${ward}</span>
                            </label>
                        </div>
                    `);
                    });
                }

                updateCheckbox();

                $('#license_filter_district').on('change', function () {
                    var selectedDistrict = $(this).val();

                    let selectedDistrictData;
                    for (let i = 0; i < district_data.count; ++i) {
                        if (district_data.districts[i].districtName === `${selectedDistrict}`) {
                            selectedDistrictData = district_data.districts[i];
                            break;
                        }
                    }

                    if (selectedDistrictData) {
                        wards = selectedDistrictData.wards;

                        $('#license_filter_ward').empty();

                        wards.forEach(function (ward) {
                            $('#license_filter_ward').append(`
                            <div class="list-group-item d-flex list-group-item-action justify-content-between align-items-center">
                                <label class="checkbox-container">
                                    <input type="checkbox" class="checkbox-input" id="${ward}">
                                    <span>Phường ${ward}</span>
                                </label>
                            </div>
                        `);
                        });

                        updateCheckbox();
                    } else {
                        console.log('District not found!');
                    }
                });
            } else {
                console.log('#license_filter_district not found!');
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
                        console.log('District not found!');
                    }
                });
            } else {
                console.log('.districtType not found!');
            }
        });

    // Get the select element
    const selectElements = document.getElementsByClassName('tackle-status');

    for (let i = 0; i < selectElements.length; ++i) {
        const selectElement = selectElements[i].id;
    
        // Add event listener for 'change' event using jQuery
        $('#' + selectElement).on('change', function () {
            // Get the selected value using jQuery
            const selectedValue = $('#' + selectElement).val();
    
            // Remove existing background color classes using jQuery
            $('#' + selectElement).removeClass('bg-danger bg-success bg-warning');
    
            // Update color based on the selected value using jQuery
            switch (selectedValue) {
                case 'Đang xử lý':
                    $('#' + selectElement).addClass('bg-warning');
                    break;
                case 'Đã xử lý':
                    $('#' + selectElement).addClass('bg-success');
                    break;
                default:
                    $('#' + selectElement).addClass('bg-danger');
                    break;
            }
        });
    }

    // Init map view only
    const detailReports = document.getElementsByClassName('detailReport');
    initMapViewOnly(detailReports);

});
