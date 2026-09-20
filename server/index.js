require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./db/db');

const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`✨ Art Deco Goal Tracker Server running on port http://localhost:${PORT}`);
});
