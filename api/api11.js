const express = require('express');
const admin = require('firebase-admin');
const app = express();
const port = 3000;
const serviceAccount = require('./mito-42b72-firebase-adminsdk-fbsvc-254edc9def.json');
const pool = require('./database/db_connect');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Replace your Web3 initialization with:
const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');

// Manually specify the ABI for uploadRecord only
const contractABI = [{
  "constant": false,
  "inputs": [{"name": "ipfsHash", "type": "string"}],
  "name": "uploadRecord",
  "outputs": [],
  "payable": false,
  "stateMutability": "nonpayable",
  "type": "function"
}];

const MedicalJSON = require('./contracts/Medical.json');
const contractAddress = "0x6A6e4EcE25d4C78F7995467B9dE32A1a2493FA60";
const healthRecords = new web3.eth.Contract(contractABI, contractAddress);
const contract = new web3.eth.Contract(
    MedicalJSON.abi, // From build/contracts/Medical.json
    "0x4FB202d3De900D6f1d68ea938C9Af7CBdf924A08" // From migration output
  );
  
  
// Initialize Web3 (assuming Ganache)
// Replace your current contract initialization with:
// const healthRecords = new web3.eth.Contract(
//     [
//         {
//             "constant": false,
//             "inputs": [{"name": "ipfsHash", "type": "string"}],
//             "name": "uploadRecord",
//             "outputs": [],
//             "payable": false,
//             "stateMutability": "nonpayable",
//             "type": "function"
//         },
//         // Include other functions as needed
//     ],
//     "0x6A6e4EcE25d4C78F7995467B9dE32A1a2493FA60"
// );

healthRecords.setProvider(web3.currentProvider);

async function getContractInstance() {
    try {
        const accounts = await web3.eth.getAccounts();
        // healthRecords is already initialized as a web3.eth.Contract
        return { 
            instance: healthRecords, 
            defaultAccount: accounts[0] 
        };
    } catch (err) {
        console.error("Contract error:", err);
        throw err;
    }
}
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
        console.log(db_response[0])
        return db_response[0][0].device_token;
    } catch (err) {
        console.error('Error fetching device token:', err);
        throw err;
    }
}

app.post("/testtest", async (req, res) => {
    try {
        // 1. First convert the document ID to bytes32
        const documentId = "12vw"; // Your document identifier
        const bytes32Id = web3.utils.keccak256(documentId);
        
        // 2. Prepare transaction parameters
        const tx = await contract.methods.uploadDocument(
            bytes32Id, // Must be bytes32 (keccak256 hash)
            "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco", // IPFS hash
            "medical" // Document type
        ).send({
            from: "0x7d0389cA1Ac9f572F3D5a1364D53Df3D69cf1FBF", // Sender address
            gas: 500000
        });
        
        console.log("Transaction hash:", tx.transactionHash);
        res.json({
            success: true,
            txHash: tx.transactionHash,
            documentId: bytes32Id
        });
        
    } catch (error) {
        console.error("Transaction failed:", error);
        res.status(500).json({
            error: "Upload failed",
            details: error.message,
            fullError: error // Remove in production
        });
    }
});
app.post('/upload-record', async (req, res) => {
    console.log(healthRecords.methods.uploadRecord("QmTest").encodeABI());
    try {
        const { ipfsHash, senderAddress } = req.body;
        
        // Verify sender is unlocked
        const accounts = await web3.eth.getAccounts();
        if (!accounts.includes(senderAddress)) {
            return res.status(400).json({ error: "Sender address not available" });
        }

        // Manually encode the transaction
        const encodedTx = healthRecords.methods.uploadRecord(ipfsHash)
            .encodeABI();
        
        const tx = {
            from: senderAddress,
            to: healthRecords.options.address,
            gas: 300000,
            data: encodedTx
        };

        const txReceipt = await web3.eth.sendTransaction(tx);
        
        res.json({
            success: true,
            txHash: txReceipt.transactionHash
        });
    } catch (err) {
        console.error('Final error:', err);
        res.status(500).json({
            error: "Transaction failed",
            details: err.message
        });
    }
});
app.get("/test",(req,res)=>{
    res.json({"HI":"HI"})
})
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
        console.log(data)
        if (!data.PhoneNumber) {
            return res.status(400).json({ error: 'PhoneNumber is required' });
        }

        const token = await getDeviceToken(data.PhoneNumber);
        console.log(token)
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
      // Safely handle missing phoneNumber
      const phone = req.body?.phoneNumber?.replace(/\D/g, '') || 'unknown';
      const safeFilename = `${phone}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, safeFilename);
    }
  });
  
  app.post("/emergency",async (req,res)=>{
    const message = {
        notification: {
            title: "Permission Request",
            body: "C1234"
        },
        data: {
            requestId: requestId.toString(),
            phoneNumber: data.PhoneNumber.toString(),
        },
        token: token
    };

    await admin.messaging().send(message);
    
    res.json("HI");
})
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
    console.log(req.body)
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



app.get('/patient-record/:address', async (req, res) => {
    try {
      const { address } = req.params;
      const { instance } = await getContractInstance();
      
      const record = await instance.getPatientRecord(address);
      res.json({ record });
    } catch (err) {
      res.status(403).json({ 
        error: "Access denied or record not found",
        details: err.message 
      });
    }
  });

app.post("/signup", async (req, res) => {
    console.log("GOT SIGNUP")
    try {
      const data = req.body;
      const { deviceToken: newToken } = req.body;
      
      if (!newToken) {
        return res.status(400).json({ error: "Device token is required" });
      }
      
      // Get contract instance
      const { instance } = await getContractInstance();
      deviceToken = newToken;
      
      const db_response = await pool.query(
        `INSERT INTO user_devices (phone_number, contract_address, device_token) 
         VALUES (?, ?, ?)`,
        [data.phone, "XxxxX", deviceToken] // Store actual contract address
      );
      
      res.json({ 
        status: "success",
        contractAddress: instance.address,
        message: "User registered with smart contract"
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