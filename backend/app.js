const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const statusRoutes = require('./routes/statusRoutes');
const gazettedRoutes = require('./routes/gazettedRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const corsOptions = {
  origin: [
    'https://icard-railways-ecor-git-main-a-sridhar-patras-projects.vercel.app', // deployed frontend
    'http://localhost:5173' // local dev
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight requests

app.use(express.json());

// Routes
app.use('/api/status', statusRoutes);
const ngRoutes = require('./routes/ngRoutes');
app.use('/api/ng', ngRoutes);
app.use('/api/gazetted', gazettedRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));