// Au début du fichier
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');  // ← AJOUTER CETTE LIGNE

const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5030;


connectDB();  

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'StockMaster API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/items', itemRoutes);
app.use('/api/auth', authRoutes);

// Middleware 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Middleware erreur global
app.use((err, req, res, next) => {
  console.error('Erreur:', err.message);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Ajoutez ceci APRÈS app.use(express.json())
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});