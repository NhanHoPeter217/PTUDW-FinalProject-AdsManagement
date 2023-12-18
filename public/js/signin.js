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
      const response = await fetch("api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonData,
      });

      // Handle the response, e.g., redirect or show a message
      const data = await response.json();
      console.log(data); // Handle the response data as needed
      window.location.href = "/";
    } catch (error) {
      console.error("Error:", error);
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
