var multer = require('multer');
var path = require('path')
function getFormattedDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}.${month}.${day}_${hours}.${minutes}.${seconds}_${Date.now()}`;
}

const configureUpload = (folderName, maxImages) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, folderName);
      },
      filename: function (req, file, cb) {
        const fileName = `${getFormattedDate()}_${file.originalname}`;
        console.log(fileName);
        cb(null, fileName);
      }
    });
  
    const upload = multer({ storage: storage, limits: { files: maxImages } }).any();
    return upload;
  };
  
module.exports = { configureUpload };

// const path = require('path');
// const fs = require('fs');
// const multer = require('multer');

// // const handleFileUpload = (req, fieldName, folderName) => {
// //     if (req.files && req.files[fieldName]) {
// //         const file = req.files[fieldName];
// //         const mainDirectory = path.resolve(__dirname, '..');
// //         const uploadPath = path.join(mainDirectory, folderName);

// //         // Create the folder if it doesn't exist
// //         if (!fs.existsSync(uploadPath)) {
// //             fs.mkdirSync(uploadPath, { recursive: true });
// //         }
// //         const fileName = `${getFormattedDate()}_${fieldName}_${file.name}`;
// //         const filePath = path.join(uploadPath, fileName);

// //         file.mv(filePath, (err) => {
// //             if (err) {
// //                 throw new Error(`Error uploading file: ${err}`);
// //             }
// //         });
// //         return filePath;
// //     }
// //     return null;
// // };

// // const handleFileUpload = (req, folderName) => {
// //     try {
// //         const uploadedImages = {};

// //         const fieldNames = Object.keys(req.files);

// //         fieldNames.forEach((fieldName) => {
// //             const files = req.files[fieldName];
// //             const mainDirectory = path.resolve(__dirname, '..');
// //             const uploadPath = path.join(mainDirectory, folderName);

// //             if (!fs.existsSync(uploadPath)) {
// //                 fs.mkdirSync(uploadPath, { recursive: true });
// //             }

// //             const filePaths = files.map((file) => {
// //                 const fileName = `${getFormattedDate()}_${file.name}`;
// //                 const filePath = path.join(uploadPath, fileName);

// //                 file.mv(filePath, (err) => {
// //                     if (err) {
// //                         throw new Error(`Error uploading file: ${err}`);
// //                     }
// //                 });

// //                 return filePath;
// //             });

// //             uploadedImages[fieldName] = filePaths;
// //         });

// //         return uploadedImages;
// //     } catch (error) {
// //         throw error;
// //     }
// // };

// const handleFileUpload = (req, folderName, maxImages, fieldName) => {
//     try {
//         const uploadedImages = {};

//         const storage = multer.diskStorage({
//             destination: function (req, file, cb) {
//                 cb(null, folderName);
//             },
//             filename: function (req, file, cb) {
//                 const fileName = `${getFormattedDate()}_${file.originalname}`;
//                 cb(null, fileName);
//             }
//         });

//         const upload = multer({ storage: storage, limits: { files: maxImages } }).single(fieldName);

//         upload(req, null, (err) => {
//             if (err) {
//                 throw new Error(`Error uploading file: ${err}`);
//             }
//             console.log(req.files);
//             const files = req.files;

//             if (files) {
//                 const filePath = files.path;
//                 uploadedImages[fieldName] = [filePath];
//             }
//         });

//         return uploadedImages;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports = handleFileUpload;

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads/reportImages')
//   },
//   filename: function (req, file, cb) {
//     const fileName = `${getFormattedDate()}_${file.originalname}`;
//     cb(null, fileName)
//   }
// })

// var upload = multer({ storage: storage });

// module.exports = { upload };