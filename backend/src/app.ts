import express from 'express';
import itemRoutes from './routes/itemRoutes';
import authRoutes from './routes/authRoutes';
import electionRoutes from './routes/electionRoutes'
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Logging middleware
app.use(morgan('combined'));

// Routes
app.use('/api/items', itemRoutes);

// Added auth routes
app.use('/api/auth', authRoutes); 

app.use('/api/elections', electionRoutes);

app.use('')

// Global error handler (should be after routes)
app.use(errorHandler);



export default app;