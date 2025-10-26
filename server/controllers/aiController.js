import OpenAI from "openai";
import db from "../utils/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
// import pdf from 'pdf-parse/lib/pdf-parse.js'


const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})


export const generateArticle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, length } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.status(403).json({ success: false, message: "Free usage limit exceeded. Please upgrade to premium plan." });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;

        await db`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'article')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { free_usage: free_usage + 1 } });
            // return res.status(200).json({ success: true, content, free_usage: free_usage + 1 });
        }

        return res.status(200).json({ success: true, content });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const generateBlogTitle = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt } = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if (plan !== 'premium' && free_usage >= 10) {
            return res.status(403).json({ success: false, message: "Free usage limit exceeded. Please upgrade to premium plan." });
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content;

        await db`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content}, 'blog-title')`;

        if (plan !== 'premium') {
            await clerkClient.users.updateUserMetadata(userId, { privateMetadata: { free_usage: free_usage + 1 } });
            // return res.status(200).json({ success: true, content, free_usage: free_usage + 1 });
        }

        return res.status(200).json({ success: true, content });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const generateImage = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { prompt, publish } = req.body;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.status(403).json({ success: false, message: "Image generation is available for premium users only." });
        }

        const formData = new FormData()
        formData.append('prompt', prompt);
        const { data } = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: { 'x-api-key': process.env.CLIPDROP_API_KEY, },
            responseType: 'arraybuffer',
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const { secure_url } = await cloudinary.uploader.upload(base64Image);

        await db`INSERT INTO creations (user_id,prompt,content,type,publish) VALUES (${userId},${prompt},${secure_url}, 'image',${publish ?? false})`;


        return res.status(200).json({ success: true, content: secure_url });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const removeImageBackground = async (req, res) => {
    try {
        const { userId } = req.auth();
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.status(403).json({ success: false, message: "Image generation is available for premium users only." });
        }


        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [{
                effect: 'background_removal',
                background_removal: 'remove_the_background'
            }]
        });



        await db`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;


        return res.status(200).json({ success: true, content: secure_url });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const removeImageObject = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { object } = req.body;
        const image = req.file;
        const plan = req.plan;

        if (plan !== 'premium') {
            return res.status(403).json({ success: false, message: "Image generation is available for premium users only." });
        }


        const { public_id } = await cloudinary.uploader.upload(image.path);


        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        });



        await db`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')`;


        return res.status(200).json({ success: true, content: imageUrl });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// export const resumeReview = async (req, res) => {
//     try {
//         const { userId } = req.auth();
//         const resume = req.file;
//         const plan = req.plan;

//         if (plan !== 'premium') {
//             return res.status(403).json({ success: false, message: "Resume review is available for premium users only." });
//         }

//         if (resume.size > 5 * 1024 * 1024) {
//             return res.status(400).json({ success: false, message: "File size exceeds the limit of 5MB." });
//         }

//         const dataBuffer = fs.readFileSync(resume.path);
//         const pdfData = await pdf(dataBuffer);

//         const prompt = `Review my resume and suggest improvements. Here is the content:\n\n${pdfData.text}`;


//         const response = await AI.chat.completions.create({
//             model: "gemini-2.0-flash",
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.7,
//             max_tokens: 1000,
//         });

//         const content = response.choices[0].message.content;


//         await db`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

//         return res.status(200).json({ success: true, content: content });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message });
//     }
// };