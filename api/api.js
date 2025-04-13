const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;
const serviceAccount = require('./mito-2e978-firebase-adminsdk-fbsvc-a214db1a48.json');
const pool = require('./database/db_connect');
const cors = require('cors')
// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let deviceToken = "";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
async function getDeviceToken(phone) {
    const db_response = await pool.query(
        `SELECT device_token from user_devices where phone_number = ?`,
        [phone]
      );
    return db_response[0][0].device_token;
}
app.get('/hospital',async (req,res)=>{
    try{
        const data = req.body;
        const token = await getDeviceToken(data.PhoneNumber);
        const message = {
            notification: {
                title: "Fetch",
                body: "P1234"
            },
            token: token
        };
        const response = await admin.messaging().send(message);
        console.log('Successfully sent notification:', response);
        res.json(token);
    }catch(err){
        console.log(err)
    }
    
})
app.get('/', async (req, res) => {
    try {
        console.log("Received GET request");
        // Uncomment to send notification
        const message = {
            notification: {
                title: "Test Notification",
                body: "This is a test notification"
            },
            token: deviceToken
        };
        const response = await admin.messaging().send(message);
        console.log('Successfully sent notification:', response);
        res.json({ message: "Hello from the server!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/signup", async (req, res) => {
    try {
        // Note: req.json() is incorrect - express.json() middleware already parsed it
        const data = req.body;
        const { deviceToken: newToken } = req.body;
        // console.log(data.PhoneNumber)
        if (!newToken) {
            return res.status(400).json({ error: "Device token is required" });
        }
        deviceToken = newToken;
        // Here you would typically:
        // 1. Validate the data
        // 2. Store in database
        // 3. Maybe send a welcome notification
        const db_response = await pool.query(
            `INSERT INTO user_devices (phone_number, contract_address, device_token) 
             VALUES (?, ?, ?)`,
            [data.PhoneNumber, '0xafaefaefae', deviceToken]
          );
        console.log(db_response);
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

// Start server
app.post("/store", async (req, res) => {
    try {
        const data = req.body;
        
        console.log(data);
        
        // Here you would typically:
        // 1. Validate the data
        // 2. Store in database with the ID
        // 3. Maybe send a confirmation
        
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
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});