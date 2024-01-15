import initMapViewOnly from './miniMap_viewonly.js';
import initMapWithSearchBox from './miniMap_searchBox.js';

document.addEventListener('DOMContentLoaded', function () {
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
        .then((response) => {
            return response.json();
        })
        .then((district_data) => {
            if (!district_data) {
                return;
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

$(document).ready(function () {

    $(document).on('submit', '#requestLicenseAdsBoardForm', function (e) {
        e.preventDefault();

        const id = e.currentTarget.getAttribute('data-id');
        const adsBoardType = document.getElementById(`license_adsBoardType-${id}`).value;
        const width = parseInt(document.getElementById(`license_width-${id}`).value);
        const height = parseInt(document.getElementById(`license_height-${id}`).value);
        const quantity = parseInt(document.getElementById(`license_quantity-${id}`).value);

        const adsBoardImages = [];
        const adsBoardImage1 = document.getElementById(`license_adsBoardImage_1-${id}`).textContent;
        const adsBoardImage2 = document.getElementById(`license_adsBoardImage_2-${id}`).textContent;
        if (adsBoardImage1) adsBoardImages.push(adsBoardImage1);
        if (adsBoardImage2) adsBoardImages.push(adsBoardImage2);

        const contractEndDate = document.getElementsByClassName(
            `license_contractEndDate-${id}`
        ).textContent;
        const contractStartDate = document.getElementsByClassName(
            `license_contractStartDate-${id}`
        ).textContent;
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
                adsBoardImages: adsBoardImages,
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

        console.log(licenseRequestData);

        fetch(`/api/v1/adsLicenseRequest/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(licenseRequestData)
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi yêu cầu cấp phép quảng cáo:', error);
            });
    });

    $(document).on('submit', '#requestEditAdsBoardForm', function (e) {
        e.preventDefault();

        const adsObject = e.currentTarget.getAttribute('data-id');
        const adsType = 'AdsBoard';
        const adsBoardType = document.getElementById(`edit_adsBoardType-${adsObject}`).value;
        const width = parseInt(document.getElementById(`edit_width-${adsObject}`).value);
        const height = parseInt(document.getElementById(`edit_height-${adsObject}`).value);
        const quantity = parseInt(document.getElementById(`edit_quantity-${adsObject}`).value);

        const adsBoardImages = [];
        const adsBoardImage1 = document.getElementById(
            `edit_adsBoardImage_1-${adsObject}`
        ).textContent;
        const adsBoardImage2 = document.getElementById(
            `edit_adsBoardImage_2-${adsObject}`
        ).textContent;
        if (adsBoardImage1) adsBoardImages.push(adsBoardImage1);
        if (adsBoardImage2) adsBoardImages.push(adsBoardImage2);

        const contractEndDate = document.getElementsByClassName(
            `edit_contractEndDate-${adsObject}`
        ).textContent;

        // will add more

        const ward = document.getElementById(`edit_ward-${adsObject}`).value;
        const district = document.getElementById(`edit_district-${adsObject}`).value;

        // const editRequestData = {
        //     licenseRequestedAdsBoard: {
        //         adsBoardType: adsBoardType,
        //         size: {
        //             width: width,
        //             height: height
        //         },
        //         quantity: quantity,
        //         adsBoardImages: adsBoardImages,
        //         contractEndDate: contractEndDate
        //     },
        //     adsContent: adsContent,
        //     companyInfo: {
        //         name: name,
        //         email: email,
        //         phone: phone,
        //         address: address
        //     },
        //     contractStartDate: contractStartDate
        // };

        console.log(editRequestData);

        fetch(`/api/v1/adsInfoEditingRequest/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editRequestData)
        })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi yêu cầu chỉnh sửa quảng cáo:', error);
            });
    });

    // Init map view only
    const detailModals = document.getElementsByClassName('detailAdsBoardModal');
    initMapViewOnly(detailModals);

    // Init map with search box
    const requestModals = document.getElementsByClassName('requestLicenseAdsBoardModal');
    initMapWithSearchBox(requestModals);
});
