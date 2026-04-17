# TASK 12: Notification Service

## Objective
Create notification service with SMS (Twilio) integration.

## Files to Create

### 12.1 Notification Service (`src/services/notification.service.js`)

```javascript
import twilio from 'twilio';

// Initialize Twilio client (if credentials available)
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

/**
 * Send SMS notification
 */
export async function sendSMS(to, message) {
  if (!twilioClient) {
    console.log(`[SMS] Would send to ${to}: ${message}`);
    return { sent: false, reason: 'Twilio not configured' };
  }
  
  try {
    const result = await twilioClient.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    
    console.log(`[SMS] Sent to ${to}: ${result.sid}`);
    return { sent: true, sid: result.sid };
  } catch (error) {
    console.error(`[SMS] Failed to send to ${to}:`, error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Send emergency alert SMS to donor
 */
export async function sendEmergencyAlert(donor, emergency) {
  const message = `🚨 BLOODLINK EMERGENCY 🚨\n\n` +
    `Blood type needed: ${emergency.bloodType}\n` +
    `Hospital: ${emergency.hospitalName}\n` +
    `Urgency: ${emergency.urgencyLevel}\n\n` +
    `Please respond to the app immediately.`;
  
  return sendSMS(donor.phone, message);
}

/**
 * Send acceptance confirmation to hospital
 */
export async function sendAcceptanceConfirmation(hospitalPhone, donor, emergency) {
  const message = `✅ BLOODLINK UPDATE ✅\n\n` +
    `Donor ${donor.name} accepted emergency.\n` +
    `Blood Type: ${emergency.bloodType}\n` +
    `ETA: ${emergency.eta || 'Calculating...'} minutes`;
  
  return sendSMS(hospitalPhone, message);
}

/**
 * Send completion notification
 */
export async function sendCompletionNotification(donorPhone, hospitalName) {
  const message = `🎉 BLOODLINK 🎉\n\n` +
    `Thank you! Your donation at ${hospitalName} has been completed.\n` +
    `You've helped save a life!`;
  
  return sendSMS(donorPhone, message);
}

/**
 * Send reminder SMS
 */
export async function sendReminder(donor, emergency) {
  const message = `⏰ BLOODLINK REMINDER ⏰\n\n` +
    `You have a pending emergency alert at ${emergency.hospitalName}.\n` +
    `Please respond in the app.`;
  
  return sendSMS(donor.phone, message);
}

// ============================================
// FCM Push Notifications (Firebase Cloud Messaging)
// ============================================

import admin from 'firebase-admin';

/**
 * Send push notification to donor
 */
export async function sendPushNotification(deviceToken, data) {
  try {
    const message = {
      notification: {
        title: data.title,
        body: data.body,
      },
      data: data.data || {},
      token: deviceToken,
    };
    
    const response = await admin.messaging().send(message);
    console.log(`[Push] Sent to ${deviceToken}: ${response}`);
    return { sent: true, response };
  } catch (error) {
    console.error(`[Push] Failed to send:`, error.message);
    return { sent: false, reason: error.message };
  }
}

/**
 * Send emergency alert push notification
 */
export async function sendEmergencyPush(deviceToken, assignment, emergency) {
  return sendPushNotification(deviceToken, {
    title: '🚨 Emergency Blood Request',
    body: `${emergency.bloodType} needed at ${emergency.hospitalName}`,
    data: {
      type: 'EMERGENCY_ALERT',
      assignmentId: assignment.id,
      emergencyId: emergency.id,
      click_action: 'OPEN_ALERT',
    },
  });
}
```

### 12.2 Add Environment Variables

```
# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 12.3 Notification Controller (`src/controllers/notification.controller.js`)

```javascript
import { sendSMS, sendEmergencyAlert, sendPushNotification } from '../services/notification.service.js';
import { getDonorByUid } from '../services/donor.service.js';
import { getEmergencyById } from '../services/emergency.service.js';

/**
 * POST /notifications/sms (admin/testing)
 * Send SMS to a number
 */
export async function sendTestSMS(req, res) {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Phone and message required' });
    }
    
    const result = await sendSMS(to, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * POST /donor/device-token (donor only)
 * Register device token for push notifications
 */
export async function registerDeviceToken(req, res) {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }
    
    // Store token in Firestore
    await db.collection('deviceTokens').doc(req.user.uid).set({
      token,
      platform: 'android', // or 'ios'
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### 12.4 Add Routes to server.js

```javascript
import { sendTestSMS, registerDeviceToken } from './src/controllers/notification.controller.js';
import { requireDonor, requireAuth } from './src/middleware/auth.middleware.js';

// Notification routes
app.post('/api/notifications/sms', requireAuth, sendTestSMS);
app.post('/api/donor/device-token', requireAuth, registerDeviceToken);
```

## Status
- [ ] Notification service created
- [ ] SMS functions (Twilio)
- [ ] Push notification functions (FCM)
- [ ] Routes added
- [ ] Environment variables documented
