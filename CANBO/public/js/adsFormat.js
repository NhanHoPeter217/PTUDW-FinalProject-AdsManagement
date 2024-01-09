// Create, Edit, Delete Ads Format
// Create Ads Format
$(document).ready(function() {
    $('#addAdsTypeForm').submit(function(e) {
        e.preventDefault();

        const name = $('#adsTypeFormName').val();

        const data = {
            name: name,
        };

        fetch('/api/v1/adsFormat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            window.location.reload();
        })
        .catch((error) => {
            console.error('Lỗi khi thêm hình thức quảng cáo:', error);
        });
    });
});

// Edit & Delete Ads Format
$(document).ready(function() {
    $(document).on('submit', '#editAdsTypeForm', function(e) {
        e.preventDefault();

        const submitedButtonId = $(document.activeElement).attr('id');
        const id = $(this).find('#edit_adsFormatName').attr('data-id');

        if (submitedButtonId === 'deleteAdsTypeButton') {
            fetch(`/api/v1/adsFormat/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi xóa loại hình thức quảng cáo:', error);
            });
        }
        else {
            const name = $(this).find('#edit_adsFormatName').val();
            const data = {
                name: name,
            };

            fetch(`/api/v1/adsFormat/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi chỉnh sửa hình thức quảng cáo:', error);
            });
        }
    });
});

// Create, Edit, Delete Report Format
// Create Report Format
$(document).ready(function() {
    $('#addReportTypeForm').submit(function(e) {
        e.preventDefault();

        const name = $('#reportTypeName').val();

        const data = {
            name: name,
        };

        fetch('/api/v1/reportFormat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            window.location.reload();
        })
        .catch((error) => {
            console.error('Lỗi khi thêm hình thức báo cáo:', error);
        });
    });
});

// Edit & Delete Report Format
$(document).ready(function() {
    $(document).on('submit', '#editReportTypeForm', function(e) {
        e.preventDefault();

        const submitedButtonId = $(document.activeElement).attr('id');
        const id = $(this).find('#edit_reportFormatName').attr('data-id');

        if (submitedButtonId === 'deleteReportTypeButton') {
            fetch(`/api/v1/reportFormat/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi xóa loại hình thức báo cáo:', error);
            });
        }
        else {
            const name = $(this).find('#edit_reportFormatName').val();
            const data = {
                name: name,
            };

            fetch(`/api/v1/reportFormat/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((data) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error('Lỗi khi chỉnh sửa hình thức báo cáo:', error);
            });
        }
    });
});