import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const originalName = file.originalname;
        const dotIndex = originalName.lastIndexOf('.');
        const baseName = originalName.substring(0, dotIndex)
        const cleadedName = baseName.replace('uploads', '');
        const ext = originalName.substring(dotIndex); // includes the dot (e.g., .jpg)

        cb(null, `${cleadedName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ storage: storage });
export default upload;