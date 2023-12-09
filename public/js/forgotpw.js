document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("resetPasswordForm");

  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting for now

    const emailInput = document.getElementById("emailInput");

    let isValid = true;

    if (!validateEmail(emailInput.value) || !emailInput.value.trim()) {
      showError("email", "Please fill out a valid email format");
      isValid = false;
    } else {
      hideError("email");

      try {
        // Send POST request to your server
        const response = await fetch("http://localhost:3000/api/v1/forgotpw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailInput.value }),
        });

        // Handle the response, e.g., redirect or show a message
        const data = await response.json();
        console.log(data); // Handle the response data as needed

        // Check if the response indicates a successful request
        if (response.ok) {
          // Redirect to the resetpw.html page
          window.location.href =
            "http://localhost:3000/public/html/resetpw.html";
        } else {
          // Handle the case when the request was not successful (e.g., display an error message)
          console.error("Error:", response.status);
          // You can display an error message or perform other actions based on your application's requirements
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  });

  function showError(inputId, errorMessage = "required") {
    const errorSpan = document.getElementById(`${inputId}-error`);
    errorSpan.textContent = errorMessage;
    errorSpan.style.visibility = "visible";
  }

  function hideError(inputId) {
    const errorSpan = document.getElementById(`${inputId}-error`);
    errorSpan.textContent = "";
    errorSpan.style.visibility = "hidden";
  }

  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }
});
