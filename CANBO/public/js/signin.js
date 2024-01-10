document.addEventListener('DOMContentLoaded', function () {
    const signinForm = document.getElementById('signinForm');

    signinForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Get input values
        const account = document.getElementById('account').value;
        const password = document.getElementById('password').value;

        // Prepare JSON data
        const jsonData = JSON.stringify({ account, password });

        try {
            // Send POST request to your server
            const response = await fetch('/auth/login/api/v1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonData
            });

            // Handle the response, e.g., redirect or show a message
            const data = await response.json();
            console.log(data); // Handle the response data as needed
            if (response.ok) {
                // Redirect to the /resetPassword page
                window.location.href = '/';
            } else {
                // Handle the case when the request was not successful (e.g., display an error message)
                console.error('Error:', response.status);
                // You can display an error message or perform other actions based on your application's requirements
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Function to redirect to Forgot Password page
    // function redirectToForgotPassword() {
    //   window.location.href = "/forgotPassword";
    // }

    // // Attach the function to the click event of the "Forgot Password" link
    // const forgotPasswordLink = document.querySelector(".forgot-password");
    // forgotPasswordLink.addEventListener("click", redirectToForgotPassword);
});
