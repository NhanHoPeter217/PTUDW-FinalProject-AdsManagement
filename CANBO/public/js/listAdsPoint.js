import initMapViewOnly from '/public/js/miniMap_viewonly.js';
import initMapWithSearchBox from '/public/js/miniMap_searchBox.js';

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

        fetch('/adsPoint/wardList/byDistrict/api/v1', {
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
        const currentDistrict = $('#filter_district').val();
        checkbox.addEventListener('change', function () {
            fetchAdsPointsByWardList(currentDistrict);
        });
    });
}

$(document).ready(function () {
    const inputRequestEditDate = $('.inputRequestEditDate');
    for (let i = 0; i < inputRequestEditDate.length; ++i) {
        initializeDatepicker(`#` + inputRequestEditDate[i].id);
    }

    const addAdsPointImages = $('.addAdsPointImages');
    for (let i = 0; i < addAdsPointImages.length; ++i) {
        const addAdsPointImage = addAdsPointImages[i].id;
        $(`#${addAdsPointImage}`).fileinput({
            dropZoneEnabled: true,
            maxFileCount: 5,
            allowedFileExtensions: ['jpg', 'png', 'pdf', 'jpeg'],
            language: 'vi',
            theme: 'fas',
            uploadExtraData: function () {
                return {
                    _token: $("input[name='_token']").val(),
                    _method: $("input[name='_method']").val(),
                    id: $("input[name='id']").val()
                };
            },
            initialPreviewAsData: true,
            initialPreviewFileType: 'image',
            showUpload: false,
            maxFileSize: 5120
        });
    }
    const requestAddAdsPointImages = $('.requestAddAdsPointImages');
    for (let i = 0; i < requestAddAdsPointImages.length; ++i) {
        const requestAddAdsPointImage = requestAddAdsPointImages[i].id;
        $(`#${requestAddAdsPointImage}`).fileinput({
            dropZoneEnabled: true,
            maxFileCount: 5,
            allowedFileExtensions: ['jpg', 'png', 'pdf', 'jpeg'],
            language: 'vi',
            theme: 'fas',
            uploadExtraData: function () {
                return {
                    _token: $("input[name='_token']").val(),
                    _method: $("input[name='_method']").val(),
                    id: $("input[name='id']").val()
                };
            },
            initialPreviewAsData: true,
            initialPreviewFileType: 'image',
            showUpload: false,
            maxFileSize: 5120
        });
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
            if (!district_data) {
                return;
            }

            if ($('#filter_district').length > 0) {
                const districts = district_data.districts;
                const currentDistrict = $('#filter_district').val();
                const currentDistrictData = districts.find(
                    (district) => district.districtName === currentDistrict
                );
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

                    // remove selected option of district
                    $(`.districtType option:selected`).removeAttr('selected');
                    $(`.districtType option[value="${selectedDistrict}"]`).prop('selected', true);

                    if (selectedDistrictData) {
                        const wards = selectedDistrictData.wards;

                        $('.wardType').empty();
                        $('.wardType').append(`<option>-- Chọn Phường --</option>`);

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

            // wardType
            if ($('.wardType').length > 0) {
                $('.wardType').on('change', function () {
                    var selectedWard = $(this).val();

                    // remove selected option of ward
                    $(`.wardType option:selected`).removeAttr('selected');
                    $(`.wardType option[value="${selectedWard}"]`).prop('selected', true);
                });
            } else {
                console.log('.wardType not found!');
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

$('.requestLocationType').on('change', function () {
    const selectedLocationType = $(this).val();
    $(`.requestLocationType option:selected`).removeAttr('selected');
    $(`.requestLocationType option[value="${selectedLocationType}"]`).prop('selected', true);
});

// $('.requestEditPlanningStatus').on('change', function () {
//     const selectedPlanningStatus = $(this).val();
//     $(`.requestEditPlanningStatus option:selected`).removeAttr('selected');
//     $(`.requestEditPlanningStatus option[value="${selectedPlanningStatus}"]`).prop('selected', true);
// });

$(document).ready(function () {
    $(document).on('submit', '#requestEditAdsPointForm', function (e) {
        e.preventDefault();

        const adsObject = e.currentTarget.getAttribute('data-id');
        const adsType = 'AdsPoint';
        const lat = document.getElementById(`lat-${adsObject}`).value;
        const lng = document.getElementById(`lng-${adsObject}`).value;
        const locationName = document.getElementById(
            `request_edit_locationName-${adsObject}`
        ).value;
        const address = document.getElementById(`request_edit_address-${adsObject}`).value;
        const ward = document.getElementById(`request_edit_ward-${adsObject}`).value;
        const district = document.getElementById(`request_edit_district-${adsObject}`).value;
        const locationType = document.getElementById(
            `request_edit_locationType-${adsObject}`
        ).value;
        const adsFormat = document.getElementById(`request_edit_adsFormat-${adsObject}`).value;
        const planningStatus = document.getElementById(
            `request_edit_planningStatus-${adsObject}`
        ).value;
        const editRequestTime = document.getElementById(
            `request_edit_editRequestTime-${adsObject}`
        ).value;
        const editReason = document.getElementById(`request_edit_editReason-${adsObject}`).value;

        const requestEditAdsPointData = {
            adsObject: adsObject,
            adsType: adsType,
            newInfo: {
                coords: {
                    lat: lat,
                    lng: lng
                },
                locationName: locationName,
                address: address,
                ward: ward,
                district: district,
                locationType: locationType,
                adsFormat: adsFormat,
                planningStatus: planningStatus
            },
            editRequestTime: editRequestTime,
            editReason: editReason,
            wardAndDistrict: {
                ward: ward,
                district: district
            }
        };

        // const jsonData = JSON.stringify(requestEditAdsPointData);
        requestEditAdsPointData.newInfo = JSON.stringify(requestEditAdsPointData.newInfo);
        requestEditAdsPointData.wardAndDistrict = JSON.stringify(requestEditAdsPointData.wardAndDistrict);

        console.log(requestEditAdsPointData);
        
        var form_data = new FormData();
        for (var key in requestEditAdsPointData) {
            form_data.append(key, requestEditAdsPointData[key]);
        }

        // const locationImages = document.getElementById(
        //     `requestAddAdsPointImages-${adsObject}`
        // ).textContent;

        const fileInput = $(`#requestAddAdsPointImages-${adsObject}`).prop('files');

        for (const file of fileInput) {
            form_data.append('requestAddAdsPointImages', file);
        }

        fetch('/adsInfoEditingRequest/', {
            method: 'POST',
            body: form_data
        }).then((response) => {
            if (response.ok) {
                alert('Yêu cầu chỉnh sửa đã được gửi thành công!');
                location.reload();
            } else {
                alert('Đã xảy ra lỗi!');
            }
        });
        // const ward = document.getElementById(`edit_ward-${adsObject}`).value;
    });

    // Init map view only
    const detailModal = document.getElementsByClassName('detailAdsPointModal');
    initMapViewOnly(detailModal);

    // Init map with search box
    const editAdsPointModal = document.getElementsByClassName('editAdsPointModal');
    initMapWithSearchBox(editAdsPointModal);

    // Init map with search box
    const requestEditAdsPointModal = document.getElementsByClassName('requestEditAdsPointModal');
    initMapWithSearchBox(requestEditAdsPointModal);

    // Init map with search box
    const createAdsPointModal = document.getElementsByClassName('addAdsPointModal');
    initMapWithSearchBox(createAdsPointModal);
});

{
    /* <select class='form-select districtType' id='edit_district-{{_id}}' required>
<option class='mb-0 softer-text fw-nomral' selected value='0'>
        -- Chọn Quận --
</option>
<option class='mb-0 softer-text fw-nomral' value='1'>
        1
</option>
<option class='mb-0 softer-text fw-nomral' value='2'>
        2
</option>
</select> */
}
