require('dotenv').config();

const twilio = require('twilio')(
  process.env.TOKEN_SID,
  process.env.TOKEN_SECRET,
  {
    accountSid: process.env.ACCOUNT_SID,
  }
);
