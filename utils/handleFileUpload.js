const path = require('path');
const fs = require('fs');
function getFormattedDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}.${month}.${day}_${hours}.${minutes}.${seconds}`;
}

// Function to handle file uploads
const handleFileUpload = (req, fieldName, folderName) => {
    if (req.files && req.files[fieldName]) {
        const file = req.files[fieldName];
        const mainDirectory = path.resolve(__dirname, '..');
        const uploadPath = path.join(mainDirectory, folderName);

        // Create the folder if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        const fileName = `${getFormattedDate()}_${fieldName}_${file.name}`;
        const filePath = path.join(uploadPath, fileName);

        file.mv(filePath, (err) => {
            if (err) {
                throw new Error(`Error uploading file: ${err}`);
            }
        });

        return filePath;
    }
    return null;
};

module.exports = { handleFileUpload };
