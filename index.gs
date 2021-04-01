// LINE Messaging API: Channel access token
const access_token = '';
// LINE Your user ID
const user_id = '';
// Set your google calendar ID
const calendar_id = '';

function getGoogleCalendar() {
  var today = new Date();

  var myCalendar = CalendarApp.getCalendarById(calendar_id);

  var myEvents = myCalendar.getEventsForDay(today);

  var message = [];

  if (myEvents.length == 0) {
    message.push('There are no events today');
  } else {
    message.push('There are ' + myEvents.length + ' events today\n');
    myEvents.forEach(function (event) {
      var eventStartTime = event.getStartTime();
      var eventEndTime = event.getEndTime();
      eventStartTime = Utilities.formatDate(eventStartTime, 'JST', 'HH:mm');
      eventEndTime = Utilities.formatDate(eventEndTime, 'JST', 'HH:mm');
      if (event.getTitle()) {
        message.push(
          '\n' +
            event.getTitle() +
            '\n' +
            '今日 from ' +
            eventStartTime +
            ' to ' +
            eventEndTime +
            '\n'
        );
      }
      if (event.getDescription()) {
        message.push(event.getDescription() + '\n');
      }
    });
    message.push('https://calendar.google.com/calendar/u/0/gp?hl=ja');
  }

  message = message.join('');

  return postMessage(message);
}

// method for post message to LINE
function postMessage(message) {
  // var url = 'https://api.line.me/v2/bot/message/push'; // Send broadcast message API (all following users without user_id)
  var url = 'https://api.line.me/v2/bot/message/broadcast';  // Sends a push message to a user, group, or room API

  var headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    Authorization: 'Bearer ' + access_token,
  };

  var postData = {
    to: user_id,
    // to: user_id,
    messages: [
      {
        type: 'text',
        text: message,
      },
    ],
  };

  var options = {
    method: 'post',
    headers: headers,
    payload: JSON.stringify(postData),
  };

  return UrlFetchApp.fetch(url, options);
}
