document.addEventListener("DOMContentLoaded", function () {
  const signinForm = document.getElementById("signinForm");

  signinForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get input values
    const account = document.getElementById("account").value;
    const password = document.getElementById("password").value;

    // Prepare JSON data
    const jsonData = JSON.stringify({ account, password });

    try {
      // Send POST request to your server
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      // Handle the response, e.g., redirect or show a message
      const data = await response.json();
      console.log(data); // Handle the response data as needed
    } catch (error) {
      console.error("Error:", error);
    }
  });

  // Function to redirect to Forgot Password page
  function redirectToForgotPassword() {
    window.location.href = "http://localhost:3000/public/html/forgotpw.html";
  }

  // Attach the function to the click event of the "Forgot Password" link
  const forgotPasswordLink = document.querySelector(".forgot-password");
  forgotPasswordLink.addEventListener("click", redirectToForgotPassword);
});
