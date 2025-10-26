import express from "express";
import { auth } from "../middlewares/auth.js";
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject } from "../controllers/aiController.js";

import { multerUpload } from "../middlewares/multer.js";


const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-image-background', multerUpload.single('image'), auth, removeImageBackground);
aiRouter.post('/remove-image-object', multerUpload.single('image'), auth, removeImageObject);
// aiRouter.post('/resume-review', multerUpload.single('resume'), auth, resumeReview);

export default aiRouter;