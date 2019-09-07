const fs = require('fs');
const sharp = require('sharp');

const resize = (file, width, height) => {
    const Buffer = fs.readFileSync(file.path);
    if (width || height) {
        return sharp(Buffer).resize(width, height).toFile(file.path);
    }
};

module.exports = { resize };