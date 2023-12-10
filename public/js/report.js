// document.addEventListener("DOMContentLoaded", function () {
//     console.log("Report form script loaded!");
  
//     const form = document.getElementById("reportForm");
//     const reportTypeInput = document.getElementById("reportType");
//     const fullNameInput = document.getElementById("fullName");
//     const emailInput = document.getElementById("email");
//     const phoneInput = document.getElementById("phone");
//     const reportContentInput = document.getElementById("reportContent");
//     const image1Input = document.getElementById("image1");
//     const image2Input = document.getElementById("image2");
  
//     form.addEventListener("submit", function (event) {
//       console.log("Form submitted");
//       let isValid = true;
  
//       // Your existing validation logic
//       isValid = validateForm();
//       grecaptcha.execute();
      
//       // Validate reCAPTCHA
//       const recaptchaResponse = grecaptcha.getResponse();
//       if (!recaptchaResponse) {
//         showError("recaptcha", "Please complete the reCAPTCHA challenge");
//         isValid = false;
//       } else {
//         hideError("recaptcha");
//       }
  
//       // If there are errors, prevent form submission
//       if (!isValid) {
//         event.preventDefault();
//       } else {
//         // Perform actions after successful form submission
//         alert("Report has been successfully submitted!");
//       }
//     });
  
//     function validateForm() {
//       let isValid = true;
  
//       // Validate reportType
//       const reportType = reportTypeInput.value;
//       if (!reportType) {
//         showError("reportType", "Please choose the report type");
//         isValid = false;
//       } else {
//         hideError("reportType");
//       }
  
//       // Validate fullName
//       const fullName = fullNameInput.value;
//       if (!fullName) {
//         showError("fullName", "Please fill out your full name");
//         isValid = false;
//       } else {
//         hideError("fullName");
//       }
  
//       // Validate email
//       const email = emailInput.value;
//       const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//       if (!email) {
//         showError("email", "Please fill out your email address");
//         isValid = false;
//       } else if (!emailRegex.test(email)) {
//         showError("email", "Please fill out a valid email address");
//         isValid = false;
//       } else {
//         hideError("email");
//       }
  
//       // Validate phone
//       const phone = phoneInput.value;
//       if (!phone) {
//         showError("phone", "Please fill out your phone number");
//         isValid = false;
//       } else {
//         hideError("phone");
//       }
  
//       // Validate reportContent
//       const reportContent = reportContentInput.value;
//       if (!reportContent) {
//         showError("reportContent", "Please fill out the report content");
//         isValid = false;
//       } else {
//         hideError("reportContent");
//       }
  
//       return isValid;
//     }
  
//     function showError(inputId, errorMessage = "Required") {
//       const errorSpan = document.getElementById(`${inputId}-error`);
//       errorSpan.textContent = errorMessage;
//       errorSpan.style.visibility = "visible";
//     }
  
//     function hideError(inputId) {
//       const errorSpan = document.getElementById(`${inputId}-error`);
//       errorSpan.textContent = "";
//       errorSpan.style.visibility = "hidden";
//     }
//   });
  