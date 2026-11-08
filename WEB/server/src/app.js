const express = require('express');
const cors = require('cors');

require('./config/database');

const customerRoutes = require('./routes/customerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const orderRoutes = require('./routes/orderRoutes');
const statsRoutes = require('./routes/statsRoutes');
const authRoutes = require('./routes/authRoutes');
const { requireAuth } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'LaundryBlackSweet API aktif.', health: '/api/health' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'LaundryBlackSweet API berjalan' });
});

app.use('/api/auth', authRoutes);
app.use('/api', requireAuth);

app.use('/api/customers', customerRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
