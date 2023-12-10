document.addEventListener("DOMContentLoaded", function () {
    submitButton = document.getElementById("submitButton");
    submitButton.addEventListener("click", function () {
        if(validateForm()){
            grecaptcha.execute();
        }
    });
    
  function validateForm() {
    let isValid = true;
  
    // Kiểm tra reportType
    var reportType = document.getElementById("reportType").value;
    if (!reportType) {
      showError("reportType", "Vui lòng chọn hình thức báo cáo");
      isValid = false;
    } else {
      hideError("reportType");
    }
  
    // Kiểm tra senderName
    var senderName = document.getElementById("fullName").value;
    if (!senderName) {
      showError("fullName", "Vui lòng nhập họ và tên");
      isValid = false;
    } else {
      hideError("fullName");
    }
  
    // Kiểm tra email
    var email = document.getElementById("email").value;
    var emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email) {
      showError("email", "Vui lòng nhập địa chỉ email");
      isValid = false;
    } else if (!emailRegex.test(email)) {
      showError("email", "Vui lòng nhập địa chỉ email hợp lệ");
      isValid = false;
    } else {
      hideError("email");
    }
  
    return isValid;
  }
  
  function showError(inputId, errorMessage = "required") {
    const errorSpan = document.getElementById(`${inputId}-error`);
    if (errorSpan) {
      errorSpan.textContent = errorMessage;
      errorSpan.style.display = "block"; // Sử dụng "block" thay vì "visible"
    }
  }
  
  function hideError(inputId) {
    const errorSpan = document.getElementById(`${inputId}-error`);
    if (errorSpan) {
      errorSpan.textContent = "";
      errorSpan.style.display = "none"; // Sử dụng "none" thay vì "hidden"
    }
  }
});

function onSubmit(token) {
    var reportType = document.getElementById("reportType").value;
    var senderName = document.getElementById("fullName").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var content = tinymce.get("reportContent").getContent();
    var image1 = document.getElementById("image1").value;
    var image2 = document.getElementById("image2").value;

    // Gửi dữ liệu đến máy chủ
    fetch("http://localhost:3000/api/v1/report", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        reportType: reportType,
        senderName: senderName,
        email: email,
        phone: phone,
        content: content,
        image1: image1,
        image2: image2,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        // Xử lý phản hồi từ máy chủ nếu cần
        console.log(data);
        alert("Báo cáo đã được gửi thành công!");
        })
        .catch((error) => {
        // Xử lý lỗi nếu có
        console.error("Lỗi khi gửi dữ liệu: ", error);
        });
}