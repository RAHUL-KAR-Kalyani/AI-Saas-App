// import OpenAI from "openai";
// import db from "../utils/db.js";
// import path from "path";
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs/promises";
// import pdfParse from "pdf-parse";
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const AI = new OpenAI({
// 	apiKey: process.env.GEMINI_API_KEY,
// 	baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });

// export const resumeReview = async (req, res) => {
// 	try {
// 		const { userId } = req.auth();
// 		const resume = req.file;
// 		const plan = req.plan;

// 		if (plan !== "premium") {
// 			return res.status(403).json({
// 				success: false,
// 				message: "Resume review is available for premium users only."
// 			});
// 		}

// 		if (!resume) {
// 			return res.status(400).json({ success: false, message: "No file uploaded." });
// 		}

// 		if (resume.size > 5 * 1024 * 1024) {
// 			return res.status(400).json({ success: false, message: "File exceeds 5MB limit." });
// 		}

// 		// Read PDF file
// 		const dataBuffer = await fs.readFile(resume.path);
// 		const pdfData = await pdfParse(dataBuffer);

// 		const prompt = `Review my resume and suggest improvements. Here is the content:\n\n${pdfData.text}`;

// 		const response = await AI.chat.completions.create({
// 			model: "gemini-2.0-flash",
// 			messages: [{ role: "user", content: prompt }],
// 			temperature: 0.7,
// 			max_tokens: 1000
// 		});

// 		const content = response.choices[0].message.content;

// 		// Save to DB
// 		await db`INSERT INTO creations (user_id, prompt, content, type) 
//              VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

// 		// Cleanup uploaded file
// 		await fs.unlink(resume.path);

// 		return res.status(200).json({ success: true, content });

// 	} catch (error) {
// 		console.error(error);
// 		return res.status(500).json({
// 			success: false,
// 			message: error?.message || "Something went wrong"
// 		});
// 	}
// };
