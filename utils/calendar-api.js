// Require google from googleapis package.
const { google } = require("googleapis")

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  "156374965130-mmgtjkm9bu2vmq40dt83919orld14nde.apps.googleusercontent.com",
  "HDnHtnH05ypZwpVmvGRABEuj"
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  refresh_token:
    "1//040ODJiPy2UodCgYIARAAGAQSNwF-L9IrzWmZ-bnQcy0Nq8POrXbZ1n-z4gQ6rcgGNFbQufdyLrLXGlr5cDOhUGhLnhRZCEWxEJY"
})

// Create a new calender instance.
const calendar = google.calendar({ version: "v3", auth: oAuth2Client })

module.exports = function createEvent (
  appointment_id,
  eventStartTime,
  eventEndTime,
  summary,
  description,
  attendees
) {
  return new Promise((resolve, reject) => {
    const event = {
      summary: summary,
      description: description,
      start: {
        dateTime: eventStartTime,
        timeZone: "Asia/Kolkata"
      },
      end: {
        dateTime: eventEndTime,
        timeZone: "Asia/Kolkata"
      },
      attendees: attendees,
      conferenceData: {
        createRequest: {
          requestId: "appointment_" + appointment_id,
          conferenceSolutionKey: {
            type: "hangoutsMeet"
          }
        }
      }
    }

    return calendar.events.insert(
      {
        calendarId: "primary",
        resource: event,
        conferenceDataVersion: "1",
        sendUpdates: "all"
      },
      (err, req) => {
        // Check for errors and log them if they exist.
        if (err) reject(err)
        // Else send the meeting link.
        resolve({ code: 200, link: req.data.hangoutLink, msg: "Created!" })
      }
    )
  })
}
