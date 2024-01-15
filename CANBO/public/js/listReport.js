// // Current URL: http://localhost:4000/admin/report/ward/2/dist/1
// const reportTemplate = {
//     id: 1,
//     schema: 'Điểm quảng cáo',
//     reportType: 'Đăng ký nội dung',
//     location: 'Dinh Độc Lập',
//     address: '135 Nam Kỳ Khởi Nghĩa, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
//     lat: 10.779422,
//     lng: 106.699018,
//     images: ['https://i.imgur.com/3Z4t1ZS.jpg', 'https://i.imgur.com/3Z4t1ZS.jpg'],
//     content: 'Đây là nội dung báo cáo',
//     status: 'Đã xử lý',
//     fullName: 'Nguyễn Văn A',
//     phoneNumber: '0123456789',
//     email: 'abc@gmail.com',
//     createdAt: '2021-10-10T00:00:00.000Z',
//     updatedAt: '2021-10-10T00:00:00.000Z'
// };

// const reportModal = new bootstrap.Modal($('#reportModal'));

// function getColor(reportType) {
//     switch (reportType) {
//         case 'Đăng ký nội dung':
//             return 'primary';
//         case 'Tố giác sai phạm':
//             return 'danger';
//         case 'Đóng góp ý kiến':
//             return 'secondary';
//         case 'Giải đáp thắc mắc':
//             return 'success';
//         default:
//             return 'primary';
//     }
// }

// const tableBody = $('#tableBody');

// tableBody.append(`                        <tr>
// <td class="border-bottom-0"><h6 class="fw-semibold mb-0">${reportTemplate.id}</h6></td>
// <td class="border-bottom-0">
//     <h6 class="fw-semibold mb-1">${reportTemplate.location}</h6>                   
// </td>
// <td class="border-bottom-0">
//     <p class="mb-0 fw-normal">${reportTemplate.type}</p>
// </td>
// <td class="border-bottom-0">
//     <div class="d-flex align-items-center gap-2">
//     <span class="badge bg-${getColor(reportTemplate.reportType)} rounded-3 fw-semibold">${
//         reportTemplate.reportType
//     }</span>
//     </div>
// </td>
// <td class="border-bottom-0">
//     <button type="button" class="btn btn-outline-primary m-1 viewReport" id="report1">Xem báo cáo</button>
// </td>
// </tr>`);

// $('.viewReport').on('click', (event) => {
//     if (event.currentTarget.id) {
//         const id = Number(event.currentTarget.id.match(/^report(.*)$/)[0]);

//         // Set label of the report modal
//         $('#reportModalLabel').text(`${reportTemplate.reportType}`);
//         $('#reportModalLabel').addClass(`text-${getColor(reportTemplate.reportType)}`);

//         $('#schema').val(reportTemplate.schema);
//         $('#location').val(reportTemplate.location);
//         $('#address').val(reportTemplate.address);

//         $('#reportContent').prop('srcdoc', reportTemplate.content);
//         $('#status').val(reportTemplate.status);
//         $('#fullName').val(reportTemplate.fullName);
//         $('#phone').val(reportTemplate.phoneNumber);
//         $('#email').val(reportTemplate.email);
//     }
//     reportModal.show();
// });

document.addEventListener('DOMContentLoaded', () => {
    $('#reportContent').html(`<p><strong>dasdasd</strong></p><p><em><strong>sdfsdf</strong></em></p><p style="text-align: center;"><span style="text-decoration:underline;">sdfsdf<br><br><em>sdfsdf</em><br></span></p>`); 
});