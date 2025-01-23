import express, { Request, Response } from 'express';
import connectDB from './db/connection';
import userRoutes from './routes/Users'; 
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

app.use(cors({ 
  origin: ' http://localhost:5173' // Replace with your frontend's origin
}));

// Routes
app.use('/api/users', userRoutes);

connectDB();

// Define a simple route for the home page
app.get('/', (req: Request, res: Response): void => {
  res.send('Backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
