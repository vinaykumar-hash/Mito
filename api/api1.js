const express = require('express')
const admin = require('firebase-admin');
const app = express()
const port = 3000;
const service_account = require('./testapplication-3b8c2-firebase-adminsdk-fbsvc-c9d4c90188.json')

admin.initializeApp({
    credential:admin.credential.cert(service_account)
})
const deviceToken = "fP-XH1Z1RzuylXIMsEhKb8:APA91bFN_9jPcjDnjke8hDWc9baxH0pWRQTsijpKkAFMC0FZU9jAQUlrt_ebrWk9xBJJWWVnPezhMv8jGbe9bWwOu4deNvPhyiJQwSFSxUd8D11pSLpIxzg"
app.use(express.json())

app.get('/' ,async (req,res)=>{
    try{const message = {
        notification: {
            title: "Action Required",
            body: "Do you approve this request?"
        },
        token: deviceToken,
        data: {  // Custom data payload
            action_type: "approval_request",
            request_id: "12345"  // Unique ID for tracking
        },
        android: {
            priority: "high",
            notification: {
                click_action: "APPROVAL_ACTION"  // For intent filtering
            }
        },
        apns: {  // For iOS (if needed)
            payload: {
                aps: {
                    category: "APPROVAL_CATEGORY"
                }
            }
        }
    };

    const response = await admin.messaging().send(message);
    res.json({ success: true, messageId: response });
    }catch(error){
        console.log(error)
    }
    
    
})

app.listen(port,()=>{
    console.log(`Listing on port ${port}`)
})