const express = require('express');
const admin = require('firebase-admin');
const https = require('https'); // Added HTTPS module
const fs = require('fs'); // Added for reading certificate files
const app = express();
const port = 3000;
const serviceAccount = require('./testapplication-3b8c2-firebase-adminsdk-fbsvc-c9d4c90188.json');

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const deviceToken = "fP-XH1Z1RzuylXIMsEhKb8:APA91bFN_9jPcjDnjke8hDWc9baxH0pWRQTsijpKkAFMC0FZU9jAQUlrt_ebrWk9xBJJWWVnPezhMv8jGbe9bWwOu4deNvPhyiJQwSFSxUd8D11pSLpIxzg";

// Middleware
app.use(express.json());

// Routes (unchanged)
app.get('/', async (req, res) => {
    try {
        console.log("Received GET request");
        res.json({ message: "Hello from the server!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/signup", async (req, res) => {
    try {
        const data = req.body;
        console.log("Received signup data:", data);
        res.json({ 
            status: "success",
            message: "User data received",
            receivedData: data 
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json({ error: "Bad request" });
    }
});

app.post("/store", async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        res.json({
            status: "success",
            message: `Data stored for ID`,
            data: data
        });
    } catch (error) {
        console.error("Store error:", error);
        res.status(500).json({ error: "Failed to store data" });
    }
});

// HTTPS Setup (only addition)
const sslOptions = {
    key: fs.readFileSync('path/to/private.key'), // Replace with your key path
    cert: fs.readFileSync('path/to/certificate.crt') // Replace with your cert path
};

// Create HTTPS server (replaced app.listen)
https.createServer(sslOptions, app).listen(port, () => {
    console.log(`HTTPS Server listening on port ${port}`);
});