require('dotenv').config();
const weekdays = process.env.WEEKDAYS.split(',');
const hourRegex = /\b(\d?\d)\s?([aApP][mM])/g;

function matchType(request, messageContent) {
  if (messageContent.includes('gym')) {
    request.session.type = 'gym';
  } else if (messageContent.includes('personal')) {
    request.session.type = 'personal trainer';
  } else if (messageContent.includes('massage')) {
    request.session.type = 'masseur';
  }

  if (!request.session.type) {
    return `Sorry I didn't undestand your request`;
  }

  request.session.step = 2;
  return `What date do you want to see the ${request.session.type}`;
}

function matchDay(request, messageContent) {
  const day = weekdays.filter((w) => messageContent.toLowerCase().includes(w));
  if (day.length === 0) {
    return "I'm not sure what day of the week do you want to make a booking for";
  }
  if (day.length > 1) {
    return `Please select just one day for the booking do you prefer ${weekday.join(
      ', '
    )} `;
  }
  request.session.step = 3;
  request.session.weekday = day[0];
  return `Do you want to book it on ${day[0]}:\n
          10am, 11am, 1pm, 4pm`;
}

function matchTime(request, messageContent) {
  const match = hourRegex.exec(messageContent);
  if (!match && match.length !== 3) {
    return `Sorry I could not understand what time do you want to come to see the ${type} on ${weekday}`;
  }
  const { type, weekday } = request.session;
  request.session.step = 4;
  request.session.time = match[0];
  return `Your appointment to see the ${type} on ${weekday} at ${match[0]} was made, please let us know if you need to change the time, otherwise see you than.`;
}

function confirmBooking(request) {
  const { type, weekday, time } = request.session;
  return `Your appointment is booked to see the ${type} on ${weekday} at ${time}. If you want to change it, please contact us at 555-5555`;
}

module.exports = {
  matchType,
  matchDay,
  matchTime,
  confirmBooking,
};
