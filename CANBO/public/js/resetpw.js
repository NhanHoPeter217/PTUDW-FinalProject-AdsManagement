const inputs = document.querySelectorAll('.otp-field > input');
const button = document.querySelector('.btn');

window.addEventListener('load', () => inputs[0].focus());
button.setAttribute('disabled', 'disabled');

inputs[0].addEventListener('paste', function (event) {
    event.preventDefault();

    const pastedValue = (event.clipboardData || window.clipboardData).getData('text');
    const otpLength = inputs.length;

    for (let i = 0; i < otpLength; i++) {
        if (i < pastedValue.length) {
            inputs[i].value = pastedValue[i];
            inputs[i].removeAttribute('disabled');
            inputs[i].focus;
        } else {
            inputs[i].value = ''; // Clear any remaining inputs
            inputs[i].focus;
        }
    }
});

inputs.forEach((input, index1) => {
    input.addEventListener('keyup', (e) => {
        const currentInput = input;
        const nextInput = input.nextElementSibling;
        const prevInput = input.previousElementSibling;

        if (currentInput.value.length > 1) {
            currentInput.value = '';
            return;
        }

        if (nextInput && nextInput.hasAttribute('disabled') && currentInput.value !== '') {
            nextInput.removeAttribute('disabled');
            nextInput.focus();
        }

        if (e.key === 'Backspace') {
            inputs.forEach((input, index2) => {
                if (index1 <= index2 && prevInput) {
                    input.setAttribute('disabled', true);
                    input.value = '';
                    prevInput.focus();
                }
            });
        }

        button.classList.remove('active');
        button.setAttribute('disabled', 'disabled');

        const inputsNo = inputs.length;
        if (!inputs[inputsNo - 1].disabled && inputs[inputsNo - 1].value !== '') {
            button.classList.add('active');
            button.removeAttribute('disabled');

            return;
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('resetPasswordForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the form from submitting for now

        // Get input values
        const email = document.getElementById('emailInput').value;
        const otpInputs = document.querySelectorAll('.otp-field > input');
        const otp = Array.from(otpInputs)
            .map((input) => input.value)
            .join('');
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate if all fields are filled
        if (!otp || !newPassword || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        // Validate if passwords match
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Prepare JSON data
        const jsonData = JSON.stringify({
            email: email,
            otp,
            newPassword
        });

        try {
            // Send POST request to reset password
            const response = await fetch('api/v1/forgotpassword/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            // Check if the response indicates a successful request (status code 200 OK)
            if (response.ok) {
                // Redirect to a success page or perform other actions as needed
                alert('Password reset successful!');
                window.location.href = '/auth/login';
            } else {
                // Handle the case when the request was not successful
                alert('Password reset failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
