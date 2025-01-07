const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json("Access Denied");

    try {
        const verified = jwt.verify(token, "WORLESTMERNSERIESBYATUL");
        req.user = verified; // Attach user info to the request
        next();
    } catch (error) {
        res.status(403).json("Invalid Token");
    }
};

// Routes

// User Signup
app.post("/users/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json("User already exists!");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into database
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        res.json(newUser.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// User Login
app.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json("Invalid credentials!");
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!isValidPassword) {
            return res.status(400).json("Invalid credentials!");
        }

        // Generate JWT token
        const token = jwt.sign({ user_id: user.rows[0].user_id }, "WORLESTMERNSERIESBYATUL", { expiresIn: "1h" });

        res.json({ token ,user});
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// User Logout
app.post("/users/logout", (req, res) => {
    // On client-side, clear the token (no server-side action required for basic logout)
    res.json("User logged out successfully!");
});

// Create a Note
app.post("/notes", authenticateToken, async (req, res) => {
    try {
        const { description } = req.body;
        const newNote = await pool.query(
            "INSERT INTO notes (user_id, description) VALUES ($1, $2) RETURNING *",
            [req.user.user_id, description]
        );
        res.json(newNote.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Get All Notes for Logged-in User
app.get("/notes", authenticateToken, async (req, res) => {
    try {
        const notes = await pool.query("SELECT * FROM notes WHERE user_id = $1", [req.user.user_id]);
        res.json(notes.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Get a Specific Note
app.get("/notes/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const note = await pool.query("SELECT * FROM notes WHERE note_id = $1 AND user_id = $2", [id, req.user.user_id]);
        if (note.rows.length === 0) return res.status(404).json("Note not found");
        res.json(note.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Update a Note
app.put("/notes/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        const updatedNote = await pool.query(
            "UPDATE notes SET description = $1 WHERE note_id = $2 AND user_id = $3 RETURNING *",
            [description, id, req.user.user_id]
        );
        if (updatedNote.rows.length === 0) return res.status(404).json("Note not found");
        res.json("Note updated successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Delete a Note
app.delete("/notes/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedNote = await pool.query("DELETE FROM notes WHERE note_id = $1 AND user_id = $2", [id, req.user.user_id]);
        if (deletedNote.rowCount === 0) return res.status(404).json("Note not found");
        res.json("Note deleted successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Start Server
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
