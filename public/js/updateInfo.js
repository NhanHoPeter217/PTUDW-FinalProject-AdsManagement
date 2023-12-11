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
  const updateForm = document.querySelector('.update-form');
  const changePasswordForm = document.querySelector('.change-password-form');

  // updateForm.addEventListener('submit', function (event) {
  //     event.preventDefault();
  //     const fullName = document.getElementById('fullName').value;
  //     const birthDate = document.getElementById('birthDate').value;
  //     const email = document.getElementById('email').value;
  //     const phone = document.getElementById('phone').value;

  //     // Prepare JSON data
  //     const jsonData = JSON.stringify({
  //         fullName,
  //         birthDate,
  //         email,
  //         phone
  //     });

  //     // Send PATCH request to update user info
  //     fetch('http://localhost:3000/api/v1/updateinfo', {
  //         method: 'PATCH',
  //         headers: {
  //             'Content-Type': 'application/json',
  //         },
  //         body: jsonData,
  //     })
  //         .then(response => {
  //             if (response.ok) {
  //                 alert('Update successful!');
  //                 // You can perform additional actions or redirect here
  //             } else {
  //                 alert('Update failed. Please try again.');
  //             }
  //         })
  //         .catch(error => {
  //             console.error('Error:', error);
  //         });
  // });

  changePasswordForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmNewPassword = document.getElementById('confirmNewPassword').value;

      // Validate if passwords match
      if (newPassword !== confirmNewPassword) {
          alert('Passwords do not match');
          return;
      }

      // Prepare JSON data
      const jsonData = JSON.stringify({
          currentPassword,
          newPassword
      });

      // Send PATCH request to update password
      fetch('http://localhost:3000/api/v1/updatepw', {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: jsonData,
      })
        .then(response => {
            if (response.ok) {
                alert('Password update successful!');
                // You can perform additional actions or redirect here
            } else {
                alert('Password update failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
  });






















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
