import initMapViewOnly from '/public/js/miniMap_viewonly.js';
import initMapWithSearchBox from '/public/js/miniMap_searchBox.js';

var districtAssigned = urlParams.get('dist');
var wardAssigned = [...new Set(urlParams.getAll('ward'))] || [];

console.log('District: ' + districtAssigned + ' Ward: ' + wardAssigned);

function initFilter() {
    // District filter
    var districtFilter = $('#filter_district');
    // districtFilter.val(districtAssigned);
    districtFilter.on('change', function () {
        var selectedDistrict = districtFilter.val();
        window.location.href = '/adsPoint/assignedArea?dist=' + selectedDistrict;
    });

    // Ward filter
    var checkBoxes = $('.checkbox-input');
    checkBoxes.on('change', function () {
        if (this.checked) {
            wardAssigned.push(this.getAttribute('data-ward'));
        } else {
            wardAssigned.splice(wardAssigned.indexOf(this.getAttribute('data-ward')), 1);
        }
        window.location.href =
            '/adsPoint/assignedArea?dist=' + districtAssigned + '&ward=' + wardAssigned.join('&ward=');
    });
}

async function initWardAndDistrict() {
    const res = await axios.get('/district/api/v1').catch((error) => {
        console.log(error);
    });
    const district_data = res.data;
    if (!district_data) {
        return;
    }

    $('.editDistrict').each(function () {
        const selectedDistrict = $(this).val();
        district_data.districts.filter((district) => {
            if (district.districtName == selectedDistrict) {
                const editWard = $(this).parent().next().find('.editWard');

                district.wards.forEach(function (ward) {
                    if (ward == editWard.val()) return;
                    editWard.append(`<option value="${ward}">${ward}</option>`);
                });
            }
        });
    });

    $('.editDistrict').on('change', function () {
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

            $('.editWard').empty();
            $('.editWard').append(
                `<option class='mb-0 softer-text fw-nomral' disabled>-- Chọn Phường --</option>`
            );

            wards.forEach(function (ward) {
                $('.editWard').append(`<option value="${ward}">${ward}</option>`);
            });
        } else {
            console.log('Không tìm thấy quận!');
        }
    });
}

$(document).ready(function () {
    initFilter();
    initWardAndDistrict();
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
        requestEditAdsPointData.wardAndDistrict = JSON.stringify(
            requestEditAdsPointData.wardAndDistrict
        );

        // console.log(requestEditAdsPointData);

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

    $(document).on('submit', '#addAdsPointForm', function (e) {
        e.preventDefault();

        const locationName = document.getElementById(`add_locationName`).value;
        const lat = document.getElementById(`add_address`).getAttribute('data-lat');
        const lng = document.getElementById(`add_address`).getAttribute('data-lng');
        const address = document.getElementById(`add_address`).value;
        const ward = document.getElementById(`add_ward`).value;
        const district = document.getElementById(`add_district`).value;
        const locationType = document.getElementById(`add_locationType`).value;
        const adsFormat = document.getElementById(`add_adsType`).value;
        const planningStatus = document.getElementById(`add_planningStatus`).value;

        // console.log(lat);
        // console.log(lng);
        // console.log(address);
        // console.log(ward);
        // console.log(district);
        // console.log(locationType);
        // console.log(adsFormat);
        // console.log(planningStatus);
        // console.log(locationName);

        const addAdsPointData = {
            location: {
                coords: {
                    lat: lat,
                    lng: lng
                },
                locationName: locationName,
                address: address,
                ward: ward,
                district: district
            },
            locationType: locationType,
            adsFormat: adsFormat,
            planningStatus: planningStatus
        };

        addAdsPointData.location = JSON.stringify(addAdsPointData.location);

        var formData = new FormData();
        for (var key in addAdsPointData) {
            formData.append(key, addAdsPointData[key]);
        }

        const fileInput = $(`#add_adsPointImages`).prop('files');

        for (const file of fileInput) {
            formData.append('add_adsPointImages', file);
        }

        console.log('Im here');

        fetch('/adsPoint/', {
            method: 'POST',
            body: formData
        }).then((response) => {
            if (response.ok) {
                alert('Tạo điểm quảng cáo mới thành công!');
                location.reload();
            } else {
                alert('Đã xảy ra lỗi khi tạo bảng quảng cáo mới!');
            }
        });
    });

    $(document).on('submit', '#editAdsPointForm', function (e) {
        e.preventDefault();

        const submitedButtonId = $(document.activeElement).attr('id');

        const adsObject = e.currentTarget.getAttribute('data-id');

        if (submitedButtonId === `saveAdsPointButton`) {
            const planningStatus = document.getElementById(
                `edit_planningStatus-${adsObject}`
            ).value;
            const locationType = document.getElementById(`edit_locationType-${adsObject}`).value;
            const adsFormat = document.getElementById(`edit_adsFormat-${adsObject}`).value;
            const locationName = document.getElementById(`edit_locationName-${adsObject}`).value;
            const address = document.getElementById(`edit_address-${adsObject}`).value;
            const lat = document
                .getElementById(`edit_address-${adsObject}`)
                .getAttribute('data-lat');
            const lng = document
                .getElementById(`edit_address-${adsObject}`)
                .getAttribute('data-lng');
            const ward = document.getElementById(`edit_ward-${adsObject}`).value;
            const district = document.getElementById(`edit_district-${adsObject}`).value;

            const editAdsPointData = {
                planningStatus: planningStatus,
                locationType: locationType,
                adsFormat: adsFormat,
                location: {
                    coords: {
                        lat: lat,
                        lng: lng
                    },
                    locationName: locationName,
                    address: address,
                    ward: ward,
                    district: district
                }
            };

            editAdsPointData.location = JSON.stringify(editAdsPointData.location);

            console.log(editAdsPointData);

            // editAdsPointData.newInfo = JSON.stringify(editAdsPointData.newInfo);
            // editAdsPointData.wardAndDistrict = JSON.stringify(editAdsPointData.wardAndDistrict);

            var form_data = new FormData();
            for (var key in editAdsPointData) {
                form_data.append(key, editAdsPointData[key]);
            }

            const fileInput = $(`#edit_adsPointImages-${adsObject}`).prop('files');

            for (const file of fileInput) {
                form_data.append('edit_adsPointImages', file);
            }

            fetch(`/adsPoint/${adsObject}`, {
                method: 'PATCH',
                body: form_data
            }).then((response) => {
                if (response.ok) {
                    alert('Cập nhật thông tin điểm quảng cáo thành công!');
                    location.reload();
                } else {
                    alert('Đã xảy ra lỗi khi cập nhật thông tin điểm quảng cáo!');
                }
            });
        } else if (submitedButtonId === `deleteAdsPointButton`) {
            fetch(`/adsPoint/${adsObject}`, {
                method: 'DELETE'
            }).then((response) => {
                if (response.ok) {
                    alert('Xóa điểm quảng cáo thành công!');
                    location.reload();
                } else {
                    alert('Đã xảy ra lỗi khi xóa điểm quảng cáo!');
                }
            });
        }
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
