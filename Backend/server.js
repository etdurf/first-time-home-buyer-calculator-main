import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, created_at FROM users",
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, created_at FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's properties
app.get("/api/users/:id/properties", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM properties WHERE user_id = $1",
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get buyer tips for user
app.get("/api/users/:id/tips", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM buyer_tips WHERE user_id = $1",
      [id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a buyer tip (mark as favorited/unfavorited)
app.put("/api/tips/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { is_favorited } = req.body;

    const result = await pool.query(
      "UPDATE buyer_tips SET is_favorited = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [is_favorited, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tip not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's mortgage settings
app.get("/api/users/:id/mortgage-settings", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM mortgage_settings WHERE user_id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      // Return default settings if none exist
      return res.json({
        user_id: id,
        loan_term: 30,
        home_price: null,
        down_payment_percent: null,
        interest_rate: null,
        annual_income: null,
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Save or update user's mortgage settings
app.post("/api/users/:id/mortgage-settings", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      loan_term,
      home_price,
      down_payment_percent,
      interest_rate,
      annual_income,
    } = req.body;

    // Check if settings exist
    const existing = await pool.query(
      "SELECT id FROM mortgage_settings WHERE user_id = $1",
      [id],
    );

    let result;
    if (existing.rows.length > 0) {
      // Update existing
      result = await pool.query(
        `UPDATE mortgage_settings 
         SET loan_term = $1, home_price = $2, down_payment_percent = $3, 
             interest_rate = $4, annual_income = $5, updated_at = CURRENT_TIMESTAMP 
         WHERE user_id = $6 RETURNING *`,
        [
          loan_term,
          home_price,
          down_payment_percent,
          interest_rate,
          annual_income,
          id,
        ],
      );
    } else {
      // Insert new
      result = await pool.query(
        `INSERT INTO mortgage_settings 
         (user_id, loan_term, home_price, down_payment_percent, interest_rate, annual_income) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          id,
          loan_term,
          home_price,
          down_payment_percent,
          interest_rate,
          annual_income,
        ],
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
