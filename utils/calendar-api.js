// Require google from googleapis package.
const { google } = require("googleapis")

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
  "720718688508-b84urtqo4vuh1g9ngdiamce3pqt17bh5.apps.googleusercontent.com",
  "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"
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
  access_token:
    "ya29.a0ARrdaM9IkIR3tooTEO1fMOTvtyCfY-ZEnkK52h9SqXUMbsfJyrOkowIklxmd5_8swnqkd6GGxGB1LSVcQ-Kbo_kRmXxz2BDRycRJSph0LEWYXM20NbR0gz9TmAYwquDm-giOjw_QqPGAZFLygYkU4N4RMVlO",
  refresh_token:
    "1//040QOBzipc52FCgYIARAAGAQSNgF-L9Ir_ZIVMecVmGQCukvVCInB1cXH1hPIk84GSGBQ_prH4yZTByN6A__dKvIPJGojWU6vLw"
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
        console.log(req)
        // Check for errors and log them if they exist.
        if (err) reject(err)
        // Else send the meeting link.
        resolve({ code: 200, link: req.data.hangoutLink, msg: "Created!" })
      }
    )
  })
}
