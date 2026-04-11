import { s3 } from "../config/cloudflare-config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";


const deleteFromR2 = async (key) => {

    if (!key) {
        return;
    }

    const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
    });


    await s3.send(command);

}


export default deleteFromR2;