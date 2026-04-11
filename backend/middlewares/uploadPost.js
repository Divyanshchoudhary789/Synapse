import multer from "multer";
const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        //Images
        "image/jpeg",
        "image/png",
        "image/webp",

        //Videos
        "video/mp4",
        "video/mpeg",
        "video/quicktime", // .mov
        "video/webm",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images and videos are allowed!"), false);
    }

};


const uploadPost = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    }
});


export default uploadPost;