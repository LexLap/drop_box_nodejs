const express = require('express');
const { Readable } = require('stream');
const { uploadImageToS3, deleteImageFromS3, getImageFromS3 } = require('../middleware/s3-handlers');
const Image = require('../models/imageModel');
const { tokenToID } = require('../middleware/authToken')
const router = new express.Router();
const fs = require('fs');
const getFileType = require('../functions/getFileType');


router.post('/upload-image', tokenToID, uploadImageToS3, async (req, res) => {

    if (!req.file) {
        res.status(422).send({
            code: 422,
            message: "File not uploaded"
        });
    }

    const fileType = getFileType(req.file.originalname)

    const image = new Image({
        originalName: req.file.originalname,
        storageName: req.file.key.split("/")[1],
        bucket: process.env.S3_BUCKET,
        region: process.env.AWS_REGION,
        key: req.file.key,
        ownerID: req.query.id,
        fileType
    });

    try {
        await image.save();

        res.send(image);
    } catch (err) {
        console.log(err);
    }
});

router.get('/get-images', tokenToID, async (req, res) => {
    const id = req.query.id
    try {
        const images = await Image.find({ownerID: id});
        if (!images) res.send([]);
        res.send(images);
    } catch (err) {
        console.log(err);
    }
});

router.get('/get-image', getImageFromS3, async (req, res) => {
    const imageName = req.query.name;
    const stream = Readable.from(req.imageBuffer);
    const fileType = getFileType(imageName)

    // res.setHeader(
    //     'Content-Disposition',
    //     'inline; filename=' + imageName
    // );

    if(fileType === 'docx'){
        res.set({
            'Content-Type':'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition':'inline'
        })
    }
    if(fileType === 'doc'){
        res.set({
            'Content-Type':'application/msword',
            'Content-Disposition':'inline'
        })
    }

    stream.pipe(res);
});

router.delete('/delete-images', deleteImageFromS3, async (req, res) => {
    try {
        await Image.findByIdAndDelete(req.body.id);
        res.send();
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;