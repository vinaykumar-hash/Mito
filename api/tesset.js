const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;
const serviceAccount = require('./mito-42b72-firebase-adminsdk-fbsvc-319bc5a2df.json');
const pool = require('./database/db_connect');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Initialize Firebase Admin
const responseStore = {};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let deviceToken = "";

// Middleware
app.use(cors());
app.use(express.json());

// Routes
async function getDeviceToken(phone) {
    console.log(phone)
    try {
        const db_response = await pool.query(
            `SELECT device_token from user_devices where phone_number = ?`,
            [phone]
        );
        return db_response[0][0].device_token;
    } catch (err) {
        console.error('Error fetching device token:', err);
        throw err;
    }
}

app.post('/notification-response', async (req, res) => {
    try {
        const { requestId, response } = req.body;
        
        if (!requestId || !response) {
            return res.status(400).json({ error: 'Missing requestId or response' });
        }
        
        // Store the response
        responseStore[requestId] = response;
        
        console.log(`Stored response for request ${requestId}:`, response);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error handling notification response:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Generate unique ID
function generateUniqueId() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

// Hospital endpoint
app.post('/hospital', async (req, res) => {
    try {
        const data = req.body;
        if (!data.PhoneNumber) {
            return res.status(400).json({ error: 'PhoneNumber is required' });
        }

        const token = await getDeviceToken(data.PhoneNumber);
        const requestId = generateUniqueId();
        
        const message = {
            notification: {
                title: "Permission Request",
                body: "P1234"
            },
            data: {
                requestId: requestId.toString(),
                phoneNumber: data.PhoneNumber.toString(),
            },
            token: token
        };

        await admin.messaging().send(message);
        
        try {
            const userResponse = await waitForResponse(requestId);
            res.json({
                token,
                userResponse,
                status: "success"
            });
        } catch (error) {
            res.json({
                token,
                userResponse: null,
                status: "timeout",
                message: "User did not respond in time"
            });
        }
    } catch (err) {
        console.error('Error in /hospital endpoint:', err);
        res.status(500).json({ 
            error: 'Internal server error',
            details: err.message 
        });
    }
});

function waitForResponse(requestId, timeout = 30000) {
    return new Promise((resolve, reject) => {
        if (responseStore[requestId]) {
            const response = responseStore[requestId];
            delete responseStore[requestId];
            return resolve(response);
        }

        const checkInterval = setInterval(() => {
            if (responseStore[requestId]) {
                clearInterval(checkInterval);
                const response = responseStore[requestId];
                delete responseStore[requestId];
                resolve(response);
            }
        }, 500);

        setTimeout(() => {
            clearInterval(checkInterval);
            delete responseStore[requestId];
            reject(new Error('Response timeout'));
        }, timeout);
    });
}



const storage1 = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './hospital_uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const phone = req.body.phoneNumber.replace(/\D/g, '') || 'unknown';
      const safeFilename = `${phone}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, safeFilename);
    }
  });
  
  const upload1 = multer({
    storage: storage1,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF files are allowed'), false);
      }
    },
    limits: {
      fileSize: 1024 * 1024 * 10 // 10MB limit
    }
  });
  
  // Modified hospital/upload endpoint with notification and response waiting
app.post("/hospital/upload", upload1.single('pdf'), async (req, res) => {
    try {
        // Validate phone number
        const phoneNumber = req.body.phoneNumber?.replace(/\D/g, '');
        if (!phoneNumber || phoneNumber.length < 10) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Valid 10-digit phone number required" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "PDF file is required" });
        }

        // Get device token
        const token = await getDeviceToken(phoneNumber);
        const requestId = generateUniqueId();

        // Store file info temporarily (will be cleaned up after response or timeout)
        responseStore[requestId] = {
            fileInfo: {
                path: req.file.path,
                originalName: req.file.originalname,
                storedName: req.file.filename,
                size: req.file.size
            },
            status: 'pending'
        };

        // Send notification
        const message = {
            notification: {
                title: "Permission Request",
                body: "P1234"
            },
            data: {
                requestId: requestId.toString(),
                phoneNumber: phoneNumber.toString(),
                fileUpload: 'true' // Flag to indicate this is for file upload
            },
            token: token
        };

        await admin.messaging().send(message);
        
        try {
            // Wait for user response
            const userResponse = await waitForResponse(requestId);
            
            // Handle user response
            if (userResponse === 'yes') {
                res.status(200).json({
                    success: true,
                    message: "File upload approved",
                    fileInfo: {
                        originalName: req.file.originalname,
                        storedName: req.file.filename,
                        size: `${(req.file.size / 1024).toFixed(1)} KB`,
                        downloadUrl: `/hospital_uploads/${req.file.filename}`
                    }
                });
            } else {
                // User rejected - delete file
                fs.unlinkSync(req.file.path);
                res.json({
                    success: false,
                    message: "File upload rejected by user",
                    userResponse: userResponse
                });
            }
        } catch (error) {
            // Timeout occurred - delete file
            fs.unlinkSync(req.file.path);
            delete responseStore[requestId];
            res.json({
                success: false,
                message: "No response from user - file deleted",
                status: "timeout"
            });
        }

    } catch (error) {
        // Cleanup on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ 
            error: "File upload failed",
            details: error.message 
        });
    }
});




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  };
  
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5
    }
  });
  
  // Upload endpoint
  app.post("/upload", upload.single('pdf'), async (req, res) => {
    try {
      const { superkey } = req.body;
      
      if (!superkey) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ error: "Superkey is required" });
      }
      
  
      if (!req.file) {
        return res.status(400).json({ error: "PDF file is required" });
      }
  
      const fileInfo = {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        superkey: superkey,
        uploadedAt: new Date()
      };
  
  
      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        fileInfo: {
          originalName: fileInfo.originalName,
          storedName: fileInfo.storedName,
          size: fileInfo.size
        }
      });
  
    } catch (error) {
      console.error("Upload error:", error);
      
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
  
      res.status(500).json({ 
        error: "File upload failed",
        details: error.message 
      });
    }
  });
app.get('/', async (req, res) => {
    try {
        console.log("Received GET request");
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
        const data = req.body;
        const { deviceToken: newToken } = req.body;
        
        if (!newToken) {
            return res.status(400).json({ error: "Device token is required" });
        }
        deviceToken = newToken;
        
        const db_response = await pool.query(
            `INSERT INTO user_devices (phone_number, contract_address, device_token) 
             VALUES (?, ?, ?)`,
            [data.PhoneNumber, '0xafaefaefae', deviceToken]
        );
        
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

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});