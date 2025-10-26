import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import connectCloudinary from './utils/cloudinary.js';
import userRouter from './routes/userRoutes.js';




const app = express();
const PORT = process.env.PORT || 8000;
const corsOption = {
	origin: 'http://localhost:5173',
	credentials: true
}


// Connect to Cloudinary
await connectCloudinary();

// Middleware
app.use(express.static('public'));
app.use(cors(corsOption));
app.use(clerkMiddleware());		// must be palce before requireAuth
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requireAuth());			// must be placed after clerkMiddleware
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
	return res.send('Server is running...........');
});

app.use('/api/ai',aiRouter);
app.use('/api/user',userRouter);



// Server
app.listen(PORT, () => {
	console.log(`Server is running at: http://localhost:${PORT}/`);
});
