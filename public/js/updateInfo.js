$(function () {
  let datePicker = document.getElementById("birthDate");
  let picker = new Litepicker({
    element: datePicker,
    format: "DD/MM/YYYY",
  });
});

function openUpdateModal() {
  $("#updateModal").modal("show");
}

function openChangePasswordModal() {
  $("#changePasswordModal").modal("show");
}
document.addEventListener("DOMContentLoaded", function () {
  const birthDateInput = document.getElementById("birthDate");

  birthDateInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    // Remove non-numeric characters
    inputValue = inputValue.replace(/\D/g, "");

    // Format the date as dd/mm/yyyy
    if (inputValue.length >= 2) {
      inputValue = inputValue.substring(0, 2) + "/" + inputValue.substring(2);
    }
    if (inputValue.length >= 5) {
      inputValue =
        inputValue.substring(0, 5) + "/" + inputValue.substring(5, 9);
    }
    event.target.value = inputValue;
  });

  const inputFields = document.querySelectorAll(".form-control");

  inputFields.forEach(function (input) {
    input.addEventListener("input", function () {
      if (input.value.trim() !== "") {
        input.classList.add("has-value");
      } else {
        input.classList.remove("has-value");
      }
    });
  });
});
