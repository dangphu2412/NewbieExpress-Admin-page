require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1'
});

const s3bucket = new AWS.S3();
const s3Upload = async (file) => {
    const params = {
        Bucket: 'sgroupit-test',
        Key: `phubucket/${file.filename.toLowerCase()}`,
        Body: fs.readFileSync(`${file.path}`),
        ContentType: file.mimetype,
        ACL: "public-read"
    };
    const data = await s3bucket.upload(params).promise();
    fs.unlinkSync(`${file.path}`);
    return data.Location;
};
module.exports = { s3Upload };