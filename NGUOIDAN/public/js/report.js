async function getAllReportFormats() {
    const res = await axios.get(`http://localhost:4000/api/v1/reportFormat`);

    const reportFormats = res.data.reportFormats;
    reportFormats.forEach((reportFormat) => {
        $('.modal-body select').append(
            `<option value="${reportFormat._id}">${reportFormat.name}</option>`
        );
    });
}
getAllReportFormats();

document.addEventListener('DOMContentLoaded', async function () {
    const submitButton = document.getElementById('submitReportButton');
    submitButton.addEventListener('click', function () {
        if (validateForm()) {
            grecaptcha.execute();
        }
    });

    function validateForm() {
        let isValid = true;

        // Kiểm tra reportFormat
        var reportFormat = document.getElementById('reportFormat').value;
        if (!reportFormat) {
            showError('reportFormat', 'Vui lòng chọn hình thức báo cáo');
            isValid = false;
        } else {
            hideError('reportFormat');
        }

        // Kiểm tra senderName
        var senderName = document.getElementById('fullName').value;
        if (!senderName) {
            showError('fullName', 'Vui lòng nhập họ và tên');
            isValid = false;
        } else {
            hideError('fullName');
        }

        // Kiểm tra email
        var email = document.getElementById('email').value;
        var emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email) {
            showError('email', 'Vui lòng nhập địa chỉ email');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError('email', 'Vui lòng nhập địa chỉ email hợp lệ');
            isValid = false;
        } else {
            hideError('email');
        }

        return isValid;
    }

    function showError(inputId, errorMessage = 'required') {
        const errorSpan = document.getElementById(`${inputId}-error`);
        if (errorSpan) {
            errorSpan.textContent = errorMessage;
            errorSpan.style.display = 'block';
        }
    }

    function hideError(inputId) {
        const errorSpan = document.getElementById(`${inputId}-error`);
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
        }
    }
});

// Add event handler to the Nút báo cáo đỏ
function reportButtonHandler(event) {
    event.preventDefault();

    // Lấy data từ nút Báo cáo đỏ
    const relatedToType = event.currentTarget.getAttribute('data-relatedToType');
    const relatedTo = event.currentTarget.getAttribute('data-relatedTo');
    const ward = event.currentTarget.getAttribute('data-ward');
    const district = event.currentTarget.getAttribute('data-district');

    // Bỏ data đó vào nút Submit của Report Modal
    const submitButton = $('#submitReportButton');
    submitButton.attr('data-relatedToType', relatedToType);
    submitButton.attr('data-relatedTo', relatedTo);
    submitButton.attr('data-ward', ward);
    submitButton.attr('data-district', district);

    $('.modal-body .alert b').text(relatedToType === 'AdsBoard' ? 'Bảng quảng cáo' : 'Điểm quảng cáo');
    $('#reportModal').modal('show');
}

function onSubmit(token) {
    var senderName = document.getElementById('fullName').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var content = tinymce.get('reportContent').getContent();

    const submitButton = $('#submitReportButton');
    let reportFormat = $('#reportFormat').val();
    let relatedToType = submitButton.attr('data-relatedToType');
    let relatedTo = submitButton.attr('data-relatedTo');
    let ward = submitButton.attr('data-ward');
    let district = submitButton.attr('data-district');
    const formData = new FormData();

    // if (relatedToType === 'Location') {
    //     relatedTo = JSON.parse(relatedTo);
    // }

    formData.append('relatedTo', relatedTo);
    if (ward && ward.length > 0) formData.append('ward', ward);
    formData.append('district', district);
    formData.append('relatedToType', relatedToType);
    formData.append('reportFormat', reportFormat);
    formData.append('senderName', senderName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('content', content);
    formData.append('image1', document.getElementById('image1').files[0]);
    formData.append('image2', document.getElementById('image2').files[0]);

    // Display the key/value pairs
    for (let pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
    }

    // Gửi dữ liệu đến máy chủ
    axios('http://localhost:4000/report/resident/api/v1', {
        method: 'POST',
        withCredentials: true,
        data: formData
    })
        .then((res) => {
            // Xử lý phản hồi từ máy chủ nếu cần
            console.log(res.data);
            alert('Báo cáo đã được gửi thành công!');
            $('#reportModal').modal('hide');
            $('#reportForm').trigger('reset');
        })
        .catch((error) => {
            // Xử lý lỗi nếu có
            console.error('Lỗi khi gửi dữ liệu: ', error, error.response.data);
        });
    grecaptcha.reset();
}

function getReport() {
    report;
}
