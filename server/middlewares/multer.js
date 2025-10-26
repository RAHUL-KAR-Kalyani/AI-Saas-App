import multer from "multer";

const storage = multer.diskStorage({});

export const multerUpload = multer({ storage });