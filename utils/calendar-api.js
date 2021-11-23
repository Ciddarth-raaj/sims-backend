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
  access_token: 'y1//04HyCgbmmnClFCgYIARAAGAQSNwF-L9Ir1eHfkIcxjSVS1EbB2Nb9Hw4T8c2as8RoxieRNlG88eae-ypLmvGDog6Mai5LPEuHTlQ',
  refresh_token: "ya29.a0ARrdaM_Bq6BLc1xH5LYwPq9lhU1UABI-BSyX-he3ywWeU4xZdMb2Fw3q3UVRkZhud2j8Vf29NHzIlNuuslrYNgiksVdN5sVIe4jyRNLOlXFNOnve951sJlfM1a2nntIC_7_Wkl5PH3CmH9Pja__jzLctPe2h"
})

// Create a new calender instance.
const calendar = google.calendar({ version: "v3", auth: oAuth2Client })

module.exports = function createEvent(
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
