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
    const inputAddAdsBoard = $('#add-adboard-form').find('input[name="contractEndDate"]');

    for (let i = 0; i < inputContractEndDate.length; ++i) {
        initializeDatepicker(`#` + inputContractEndDate[i].getAttribute('id'));
        initializeDatepicker(`#` + inputContractStartDate[i].getAttribute('id'));
        initializeDatepicker(`#` + inputs[i].getAttribute('id'));
    }
    initializeDatepicker(`#` + inputAddAdsBoard[0].getAttribute('id'));

    $('.edit_district').on('change', function () {
        const wardElement = $(this).parent().parent().find('.edit_ward');
        var selectedDistrict = $(this).val();

        try {
            let wards = district_data.find((d) => d.districtName === selectedDistrict).wards;

            wardElement.empty();
            wardElement.append(
                `<option class='mb-0 softer-text fw-nomral' selected disabled>-- Chọn Phường --</option>`
            );

            wards.forEach(function (ward) {
                wardElement.append(`<option value="${ward}">${ward}</option>`);
            });
        } catch (error) {
            wardElement.html(
                `<option class='mb-0 softer-text fw-nomral' selected disabled>-- Không có phường --</option>`
            );
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

        const files = $(`#image-input-license-${id}`).prop('files');
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
                // alert('Yêu cầu cấp phép quảng cáo thành công!');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi yêu cầu cấp phép quảng cáo:', error);
            });
    });

    $('.requestEditAdsBoardForm').on('submit', async function (e) {
        e.preventDefault();
        const mode = e.currentTarget.getAttribute('data-mode');
        const adsObject = e.currentTarget.getAttribute('data-id');
        const adsBoardType = document.getElementById(`edit_adsBoardType-${adsObject}`).value;
        const width = parseInt(document.getElementById(`edit_width-${adsObject}`).value);
        const height = parseInt(document.getElementById(`edit_height-${adsObject}`).value);
        const quantity = parseInt(document.getElementById(`edit_quantity-${adsObject}`).value);
        const contractEndDate = document.getElementsByClassName(
            `edit_contractEndDate-${adsObject}`
        )[0].value;

        let reason, ward, district;
        if (mode === 'Yêu cầu chỉnh sửa') {
            reason = document.getElementById(`edit_reason-${adsObject}`).value;
            ward = document.getElementById(`edit_ward-${adsObject}`).value;
            district = document.getElementById(`edit_district-${adsObject}`).value;
        }

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
        if (mode === 'Yêu cầu chỉnh sửa') {
            formData.append('adsType', 'AdsBoard');
            formData.append('adsObject', adsObject);
            formData.append('data', JSON.stringify(editRequestData));
            // axios
            await axios
                .post(`/adsInfoEditingRequest`, formData)
                .then((response) => {
                    // alert('Yêu cầu thông tin quảng cáo thành công!');
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Lỗi khi yêu cầu chỉnh sửa thông tin quảng cáo:', error);
                });
        } else {
            formData.append('data', JSON.stringify(editRequestData.newInfo));
            // axios
            await axios
                .patch(`/adsBoard/` + adsObject, formData)
                .then((response) => {
                    // alert('Chỉnh sửa thông tin quảng cáo thành công!');
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Lỗi khi yêu cầu chỉnh sửa thông tin quảng cáo:', error);
                });
        }
    });

    // Delete ads board
    $('.delete-ads-board-btn').on('click', async function (e) {
        e.preventDefault();
        const adsBoardId = e.currentTarget.getAttribute('data-id');
        await axios
            .delete(`/adsBoard/${adsBoardId}`)
            .then((response) => {
                // alert('Xóa bảng quảng cáo thành công!');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi xóa bảng quảng cáo:', error);
            });
    });

    // Add ads board Form
    const addAdsBoardForm = $('#add-adboard-form');
    addAdsBoardForm.on('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData();
        const adsPoint = addAdsBoardForm.find('input[name="adsPoint"]').val();
        const adsBoardType = addAdsBoardForm.find('select[name="adsBoardType"]').val();
        const width = parseInt(addAdsBoardForm.find('input[name="width"]').val());
        const height = parseInt(addAdsBoardForm.find('input[name="height"]').val());
        const quantity = parseInt(addAdsBoardForm.find('input[name="quantity"]').val());
        const contractEndDate = addAdsBoardForm.find('input[name="contractEndDate"]').val();
        const files = addAdsBoardForm.find('input[type="file"]').prop('files');
        if (files) {
            for (let file of files) {
                formData.append('images[]', file);
            }
        }

        const adsBoardData = {
            adsPoint: adsPoint,
            adsBoardType: adsBoardType,
            size: {
                width: width,
                height: height
            },
            quantity: quantity,
            contractEndDate: contractEndDate
        };

        formData.append('data', JSON.stringify(adsBoardData));

        // Display the key/value pairs
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        await axios
            .post(`/adsBoard/`, formData)
            .then((response) => {
                // alert('Thêm bảng quảng cáo thành công!');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi thêm bảng quảng cáo:', error);
            });
    });

    // Init map view only
    const detailModals = document.getElementsByClassName('detailAdsBoardModal');
    initMapViewOnly(detailModals);

    // Init map with search box
    const requestModals = document.getElementsByClassName('requestLicenseAdsBoardModal');
    initMapWithSearchBox(requestModals);
});
