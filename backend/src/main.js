const bookingHelper = require('./bookingHelper');

const bodyParser = require('body-parser');
const session = require('express-session');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
require('dotenv').config();

const server = require('express')();
server.use(bodyParser.urlencoded({ extended: true }));
server.use(session({ secret: process.env.SESSION_SECRET }));
const port = process.env.EXPRESS_PORT || 3001;

server.get('/test', (request, response) => {
  response.send('Hello from nodemon started with the script');
});

server.post('/receive-sms', (request, response) => {
  const messageContent = request.body.Body.toLowerCase();
  const step = request.session.step;
  console.log('step', step);
  let message;
  if (!step) {
    request.session.step = 1;
    message = `Hi, do you want to book an appointment to: \n
    see the gym \n
    book a personal trainer \n
    book a massage`;
  } else {
    switch (step) {
      case 1:
        message = bookingHelper.matchType(request, messageContent);
        break;
      case 2:
        message = bookingHelper.matchDay(request, messageContent);
        break;
      case 3:
        message = bookingHelper.matchTime(request, messageContent);
        break;
      case 4:
        message = bookingHelper.confirmBooking(request);
      default:
        console.log(`Could not find the step for value: ${step}`);
    }
  }
  const twiml = new MessagingResponse();
  twiml.message(message);
  console.log('response', twiml.toString());
  response.set('Content-Type', 'text/xml');
  response.send(twiml.toString());
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
