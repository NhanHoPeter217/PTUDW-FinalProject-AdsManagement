const fs = require('fs');
const path = require('path');

function getContentTypeFromExtension(extension) {
    const contentTypeMap = {
        png: 'image/png',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        pdf: 'application/pdf'
    };

    return contentTypeMap[extension.toLowerCase()] || 'application/octet-stream';
}

function getFileExtension(filePath) {
    return path.extname(filePath).slice(1);
}

function getImageData(absolutePath, imagePath) {
    const imageBuffer = fs.readFileSync(absolutePath);

    return {
        filename: path.basename(imagePath),
        contentType: getContentTypeFromExtension(getFileExtension(imagePath)),
        data: imageBuffer.toString('base64')
    };
}

module.exports = {
    getImageData
};
