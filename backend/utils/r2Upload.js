import crypto from "crypto";
import { s3 } from "../config/cloudflare-config.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const uploadToR2 = async (file, folder = "uploads") => {
    const fileExtension = file.originalname.split(".").pop();
    let subFolder;
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    if (file.mimetype.startsWith("video")) {
        subFolder = "videos";
    }

    if (file.mimetype.startsWith("image")) {
        subFolder = "images";
    }

    const key = `${folder}/${subFolder}/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    });

    await s3.send(command);


    const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return {
        url: fileUrl,
        key
    };


}

export default uploadToR2;