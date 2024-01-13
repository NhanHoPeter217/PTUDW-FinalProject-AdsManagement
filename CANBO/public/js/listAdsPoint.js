function updateCheckbox() {
                        // Get all the checkbox elements
                        const checkboxes = document.querySelectorAll('.checkbox-input');
                        const wardList = [];

                        function fetchAdsPointsByWardList() {
                            const checkboxes = document.querySelectorAll('.checkbox-input');
                            wardList.length = 0; // Clear the wardList array

                            Array.from(checkboxes).forEach(function (checkbox) {
                                if (checkbox.checked) {
                                    wardList.push(checkbox.id);
                                }
                            });

                            fetch('/adsPoint/wardList/api/v1', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    wardList: wardList
                                })
                            })
                                .then((response) => {
                                    return response.json();
                                })
                                .then((adsPoints_data) => {
                                    $('#body').empty();

                                    console.log($('#body'));

                                    if (!adsPoints_data) {
                                        return;
                                    }

                                    const adsPoints = adsPoints_data.adsPoints;

                                    var index = 0;

                                    adsPoints.forEach(function (adsPoint) {
                                        index += 1;
                                        $('#body').append(`
                                            <tr>
                                                <td class="align-middle">${index}</td>
                                                <td class="align-middle">
                                                    <button type="button" class="btn btn-link" data-bs-toggle="modal" data-bs-target="#detailAdsPointModal-${adsPoint._id}">
                                                        ${adsPoint.location.locationName}
                                                    </button>
                                                </td>
                                                <td class="border-bottom-0 align-middle">
                                                <a class="btn btn-primary m-1" href="/adsBoard/adsPoint/${adsPoint._id}" role="button">
                                                    <img src="../../../public/assets/icons/Board_icon.svg" alt="" width="20" height="20" />
                                                </a>
                                                </td>
                                                <td class="border-bottom-0 align-middle">
                                                    <button
                                                        type="button"
                                                        class="btn btn-outline-warning m-1"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#requestEditAdsPointModal-${adsPoint._id}">
                                                        <div id="buttonStyle">
                                                            <img src="../../../public/assets/icons/Edit_icon.svg" alt="" width="24" height="24" />
                                                            Yêu cầu chỉnh sửa
                                                        </div>
                                                    </button>
                                                </td>
                                            </tr>
                                    `);
                                    });
                                });
                        }

                        // Add event listeners to each checkbox
                        checkboxes.forEach(function (checkbox) {
                            checkbox.addEventListener('change', function () {
                                fetchAdsPointsByWardList();
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

            
            if ($('#filter_district').length > 0) {

                const districts = district_data.districts;
                const currentDistrict = $('#filter_district').val();
                const currentDistrictData = districts.find((district) => district.districtName === currentDistrict);
                var wards = [];
                if (currentDistrictData) {
                    wards = currentDistrictData.wards;
                    $('#filter_ward').empty();

                    wards.forEach(function (ward) {
                        $('#filter_ward').append(`
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

                $('#filter_district').on('change', function () {
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

                        $('#filter_ward').empty();

                        wards.forEach(function (ward) {
                            $('#filter_ward').append(`
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
                console.log('#filter_district not found!');
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
});

$('#detailAdsPointModal').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget);
    const index = button.data('bs-index');

    // Fetch the adsPoint data based on the index or any other logic you use
    const adsPoint = this.adsPoints[index];

    // Update modal content dynamically based on the adsPoint data
    const modal = $(this);
    modal.find('.modal-content #locationName').text(adsPoint.location.locationName);
    modal.find('.modal-content #district').text(adsPoint.location.district);
    modal.find('.modal-content #ward').text(adsPoint.location.ward);
});

$(document).ready(function () {
    $(document).on('submit', '#requestEditAdsPointForm', function (e) {
        e.preventDefault();

        const adsObject = e.currentTarget.getAttribute('data-id');
        const adsType = "AdsPoint";
        const lat = document.getElementById(`lat-${adsObject}`).value;
        const lng = document.getElementById(`lng-${adsObject}`).value;
        const locationName = document.getElementById(`edit_locationName-${adsObject}`).value;
        const address = document.getElementById(`edit_address-${adsObject}`).value;
        const ward = document.getElementById(`edit_ward-${adsObject}`).value;
        const district = document.getElementById(`edit_district-${adsObject}`).value;
        const locationType = document.getElementById(`edit_locationType-${adsObject}`).value;
        const adsFormat = document.getElementById(`edit_adsFormat-${adsObject}`).value;

        const locationImages = [];
        const locationImage1 = document.getElementById(`edit_locationImage_1-${adsObject}`).textContent;
        const locationImage2 = document.getElementById(`edit_locationImage_2-${adsObject}`).textContent;

        const planningStatus = document.getElementById(`edit_planningStatus-${adsObject}`).value;

        // const ward = document.getElementById(`edit_ward-${adsObject}`).value;

    });
});
