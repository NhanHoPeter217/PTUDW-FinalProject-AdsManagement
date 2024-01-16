// Verify or not verify request
$(document).ready(function () {
    $(document).on('submit', '#detailAdsBoardRequestForm', function (e) {
        e.preventDefault();

        const id = e.currentTarget.getAttribute('data-id');

        // if (submitedButtonId === 'noVerifyRequestEditAdsBoard') {
            fetch(`/adsInfoEditingRequest/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "requestApprovalStatus": 'Đã được duyệt' })
            })
                .then((response) => response.json())
                .then((data) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Lỗi khi duyệt yêu cầu chỉnh sửa bảng quảng cáo:', error);
                });
        // } else {
        //     const name = $(`#edit_adsFormatName-${id}`).val();

        //     const data = {
        //         name: name
        //     };

        //     fetch(`/api/v1/adsFormat/${id}`, {
        //         method: 'PATCH',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(data)
        //     })
        //         .then((response) => response.json())
        //         .then((data) => {
        //             window.location.reload();
        //         })
        //         .catch((error) => {
        //             console.error('Lỗi khi chỉnh sửa hình thức quảng cáo:', error);
        //         });
        // }
    });
});

$(document).ready(function () {
    $(document).on('submit', '#detailAdsPointRequestForm', function (e) {
        e.preventDefault();

        const id = e.currentTarget.getAttribute('data-id');

            fetch(`/adsInfoEditingRequest/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "requestApprovalStatus": 'Đã được duyệt' })
            })
                .then((response) => response.json())
                .then((data) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Lỗi khi duyệt yêu cầu chỉnh sửa điểm quảng cáo:', error);
                });
    });
});