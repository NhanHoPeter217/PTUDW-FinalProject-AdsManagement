$(document).ready(function() {
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
        if (!district_data) { return; }

        if ($('#filter_district').length > 0) {
            $('#filter_district').on('change', function() {
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

                    $('#filter_ward').empty();

                    wards.forEach(function(ward) {
                        $('#filter_ward').append(`
                            <div class="list-group-item d-flex list-group-item-action justify-content-between align-items-center">
                                <label class="checkbox-container">
                                    <input type="checkbox" class="checkbox-input" id="${ward}">
                                    <span>Phường ${ward}</span>
                                </label>
                            </div>
                        `);
                    });
                    
                    // Get all the checkbox elements
                    const checkboxes = document.querySelectorAll('.checkbox-input');
                    const wardList = [];

                    function fetchAdsPointsByWardList() {
                        const checkboxes = document.querySelectorAll('.checkbox-input');
                        wardList.length = 0; // Clear the wardList array

                        Array.from(checkboxes).forEach(function(checkbox) {
                            if (checkbox.checked) {
                                wardList.push(checkbox.id);
                            }
                        });

                        fetch('/api/v1/adsPoint/wardList', {
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



                        
                    }

                    // Add event listeners to each checkbox
                    checkboxes.forEach(function(checkbox) {
                        checkbox.addEventListener('change', function() {
                            fetchAdsPointsByWardList();
                        });
                    });

                } else {
                    console.log('District not found!');
                }
            });
        } else {
            console.log('#filter_district not found!');
        }
        
        if ($('#edit_district').length > 0) {
            $('#edit_district').on('change', function() {
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

                    $('#edit_ward').empty();
                    $('#edit_ward').append(`<option class='mb-0 softer-text fw-nomral' selected disabled>-- Chọn Phường --</option>`);

                    wards.forEach(function(ward) {
                        $('#edit_ward').append(`<option value="${ward}">${ward}</option>`);
                    });
                } else {
                    console.log('District not found!');
                }
            });
        } else {
            console.log('#edit_district not found!');
        }
    });
});