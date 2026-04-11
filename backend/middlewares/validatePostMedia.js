

const validatePostMedia = (req, res, next) => {
    try {

        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No Files Uploaded!" });
        }

        let videoCount = 0;

        for (let file of files) {
            if (file.mimetype.startsWith("video")) {
                videoCount++;
            }
        }

        //More than 1 video
        if (videoCount > 1) {
            return res.status(400).json({ message: "Only 1 video allowed per post" });
        }

        // video + image mix case
        if (videoCount === 1 && files.length > 1) {
            return res.status(400).json({ message: "If uploading a video, only 1 file is allowed" });
        }

        // max 5 files
        if (files.length > 5) {
            return res.status(400).json({ message: "Maximum 5 files allowed" });
        }


        next();

    } catch (err) {
        return res.status(500).json({ message: "Validation Failed!", error: err.message });
    }
}


export default validatePostMedia;