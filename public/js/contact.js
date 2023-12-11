document.addEventListener('DOMContentLoaded', function () {
    console.log('Contact form script loaded!');

    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const captchaInput = document.getElementById('captcha');

    // Generate a random arithmetic operation
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const correctAnswer = num1 + num2;

    // Display the arithmetic operation in the captcha field
    const captchaLabel = document.getElementById('captcha-label');
    captchaLabel.textContent = `${num1} + ${num2} = ?`;

    form.addEventListener('submit', function (event) {
        console.log('Form submitted');
        let isValid = true;

        // Kiểm tra tên
        if (!nameInput.value.trim()) {
            showError('name', 'Please fill out your name');
            isValid = false;
        } else {
            hideError('name');
        }

        // Kiểm tra email
        if (!validateEmail(emailInput.value) || !emailInput.value.trim()) {
            showError('email', 'Please fill out a valid email format');
            isValid = false;
        } else {
            hideError('email');
        }

        // Kiểm tra captcha
        if (parseInt(captchaInput.value) !== correctAnswer) {
            showError('captcha', 'Please fill out a correct answer');
            isValid = false;
        } else {
            hideError('captcha');
        }

        // Nếu có lỗi, ngăn chặn việc gửi form
        if (!isValid) {
            event.preventDefault();
        } else {
            alert('Thank you for your information!');
        }
    });

    function showError(inputId, errorMessage = 'required') {
        const errorSpan = document.getElementById(`${inputId}-error`);
        errorSpan.textContent = errorMessage;
        errorSpan.style.visibility = 'visible';
    }

    function hideError(inputId) {
        const errorSpan = document.getElementById(`${inputId}-error`);
        errorSpan.textContent = '';
        errorSpan.style.visibility = 'hidden';
    }

    function validateEmail(email) {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    }
});
