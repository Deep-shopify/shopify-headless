const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Twilio credentials
const accountSid = 'AC8521fc78ee26850dd18b0c32d4467550'; // Your Twilio Account SID
const authToken = '94e9b866495a79cc33450931c69206c6'; // Your Twilio Auth Token
const twilioNumber = '+12548750220'; // Your Twilio phone number in E.164 format

const client = twilio(accountSid, authToken);

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  // Validate phoneNumber format (E.164)
  if (!/^(\+?\d{1,15})$/.test(phoneNumber)) {
    return res.status(400).json({ success: false, message: 'Invalid phone number format. Please use E.164 format.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP

  client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: twilioNumber,
      to: phoneNumber,
    })
    .then(() => res.json({ success: true, otp })) // Send OTP back for verification
    .catch((error) => {
      console.error('Twilio Error:', error); // Log the entire error object
      res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
