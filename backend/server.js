const express = require("express");
const cors = require("cors");
const path = require("path");
const { logger } = require("./middleware/logger.js");
const authRouter = require("./routes/authRoutes.js");
const npcDialogueRoutes = require("./routes/npcDialogueRoutes.js");

// ייבוא ה-Instance של Sequelize מהתיקייה החדשה
// וודא שבתוך db/models יש קובץ index.js שתומך ב-ES Modules
const db = require("./db/models/index.js");

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.use(logger);

// API Routes
app.use("/auth", authRouter);
app.use("/api/npc-dialogue", npcDialogueRoutes);

// Catch-all route to serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// פונקציה להפעלת השרת רק לאחר חיבור מוצלח ל-DB
const startServer = async () => {
  try {
    // בדיקת חיבור ל-PostgreSQL
    await db.sequelize.authenticate();
    console.log('✅ Connection to PostgreSQL has been established successfully.');

    // הפעלת השרת
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // סגירת התהליך אם אין חיבור ל-DB
  }
};

startServer();