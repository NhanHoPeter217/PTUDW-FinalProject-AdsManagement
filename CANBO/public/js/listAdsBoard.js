import initMapViewOnly from './miniMap_viewonly.js';
import initMapWithSearchBox from './miniMap_searchBox.js';

var date = new Date();
const formattedDate = () => {
    var year = date.getFullYear();
    var month = date.getMonth() + 1; // getMonth() returns a zero-based value (0-11)
    var day = date.getDate();

    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
};

$(document).ready(function () {
    const inputContractEndDate = $('.license_contractEndDate');
    const inputContractStartDate = $('.license_contractStartDate');
    const inputs = $('.edit_contractEndDate');
    for (let i = 0; i < inputContractEndDate.length; ++i) {
        initializeDatepicker(`#` + inputContractEndDate[i].getAttribute('id'));
        initializeDatepicker(`#` + inputContractStartDate[i].getAttribute('id'));
        initializeDatepicker(`#` + inputs[i].getAttribute('id'));
    }
    fetch('/district/api/v1', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((district_data) => {
            if (!district_data) {
                return;
            }
            if ($('.edit_district').length > 0) {
                $('.edit_district').on('change', function () {
                    const wardElement = $(this).parent().parent().find('.edit_ward');
                    var selectedDistrict = $(this).val();

                    let wards = district_data.districts.find(
                        (d) => d.districtName === selectedDistrict
                    ).wards;

                    if (wards) {
                        wardElement.empty();
                        wardElement.append(
                            `<option class='mb-0 softer-text fw-nomral' selected disabled>-- Chọn Phường --</option>`
                        );

                        wards.forEach(function (ward) {
                            wardElement.append(`<option value="${ward}">${ward}</option>`);
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
        datepicker(inputId, {
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

$(document).ready(function () {
    $('.requestLicenseAdsBoardForm').on('submit', async function (e) {
        e.preventDefault();
        const id = e.currentTarget.getAttribute('data-id');
        const adsBoardType = document.getElementById(`license_adsBoardType-${id}`).value;
        const width = parseInt(document.getElementById(`license_width-${id}`).value);
        const height = parseInt(document.getElementById(`license_height-${id}`).value);
        const quantity = parseInt(document.getElementById(`license_quantity-${id}`).value);

        const contractEndDate = document.getElementsByClassName(`license_contractEndDate-${id}`)[0]
            .value;
        const contractStartDate = document.getElementsByClassName(
            `license_contractStartDate-${id}`
        )[0].value;
        const adsContent = document.getElementById(`license_adsContent-${id}`).value;
        const name = document.getElementById(`license_companyName-${id}`).value;
        const email = document.getElementById(`license_companyEmail-${id}`).value;
        const phone = document.getElementById(`license_companyPhone-${id}`).value;
        const address = document.getElementById(`license_companyAddress-${id}`).value;

        const licenseRequestData = {
            licenseRequestedAdsBoard: {
                adsBoardType: adsBoardType,
                size: {
                    width: width,
                    height: height
                },
                quantity: quantity,
                images: 'temp',
                contractEndDate: contractEndDate
            },
            adsContent: adsContent,
            companyInfo: {
                name: name,
                email: email,
                phone: phone,
                address: address
            },
            contractStartDate: contractStartDate
        };

        const formData = new FormData();

        const files = $('#image-input-' + id).prop('files');
        if (files) {
            for (let file of files) {
                formData.append('images[]', file);
            }
        }
        formData.append('data', JSON.stringify(licenseRequestData));

        // Display the key/value pairs
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        await axios
            .post(`/adsLicenseRequest/${id}`, formData)
            .then((response) => {
                alert('Yêu cầu cấp phép quảng cáo thành công!');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi yêu cầu cấp phép quảng cáo:', error);
            });
    });

    $('.requestEditAdsBoardForm').on('submit', async function (e) {
        e.preventDefault();
        const adsObject = e.currentTarget.getAttribute('data-id');
        const adsBoardType = document.getElementById(`edit_adsBoardType-${adsObject}`).value;
        const width = parseInt(document.getElementById(`edit_width-${adsObject}`).value);
        const height = parseInt(document.getElementById(`edit_height-${adsObject}`).value);
        const quantity = parseInt(document.getElementById(`edit_quantity-${adsObject}`).value);
        const reason = document.getElementById(`edit_reason-${adsObject}`).value;
        const contractEndDate = document.getElementsByClassName(
            `edit_contractEndDate-${adsObject}`
        )[0].value;
        const ward = document.getElementById(`edit_ward-${adsObject}`).value;
        const district = document.getElementById(`edit_district-${adsObject}`).value;

        const editRequestData = {
            adsObject: adsObject,
            adsType: 'AdsBoard',
            newInfo: {
                adsBoardType: adsBoardType,
                size: {
                    width: width,
                    height: height
                },
                quantity: quantity,
                contractEndDate: contractEndDate
            },
            editRequestTime: formattedDate(),
            editReason: reason,
            wardAndDistrict: {
                ward: ward,
                district: district
            }
        };

        const formData = new FormData();
        const files = $(`#image-input-${adsObject}`).prop('files');
        console.log(files);
        if (files) {
            for (let file of files) {
                formData.append('images[]', file);
            }
        }
        formData.append('data', JSON.stringify(editRequestData));

        // axios
        await axios
            .post(`/adsInfoEditingRequest`, formData)
            .then((response) => {
                alert('Yêu cầu / Chỉnh sửa thông tin quảng cáo thành công!');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi yêu cầu chỉnh sửa thông tin quảng cáo:', error);
            });
    });

    // Init map view only
    const detailModals = document.getElementsByClassName('detailAdsBoardModal');
    initMapViewOnly(detailModals);

    // Init map with search box
    const requestModals = document.getElementsByClassName('requestLicenseAdsBoardModal');
    initMapWithSearchBox(requestModals);
});
