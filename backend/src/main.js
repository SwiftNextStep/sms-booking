const { response } = require('express');

require('dotenv').config();

const server = require('express')();

const port = process.env.EXPRESS_PORT || 3001;

server.get('/test', (request, response) => {
  response.send('Hello from nodemon started with the script');
});
server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const from = process.env.PHONE_NUMBER;
const to = process.env.MY_NUMBER;

const twilio = require('twilio')(
  process.env.TOKEN_SID,
  process.env.TOKEN_SECRET,
  {
    accountSid: process.env.ACCOUNT_SID,
  }
);

function sendSms() {
  twilio.messages
    .create({
      from,
      to,
      body: 'Hello from Twilio',
    })
    .then((message) => console.log(`Message sent with sid ${message.sid}`))
    .catch((error) => console.error(error));
}
