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
  access_token: 'ya29.a0ARrdaM-zki9iNoDgQVk6uoib1w9NzFqiSEjKx0MNA3ufVNmhnv-fJ6cMXhw1t2F3HPVD0j9fDa57XiMppt4ZEKc6RHbpycHkNfqb2pkPXL5C1FFGi8CXU37ueu2TDX_cHyt2gRUs6JFOlHFsdBiHZyfyw9cw',
  refresh_token: "1//04Tcs_NVG5c3yCgYIARAAGAQSNwF-L9IrOqF-I8Nl-MNUJhv_sa9v4a4yUZ-FFOLCKWjldAoqV74RoVJ46Akq5_UCqjYEydiGTI0"
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
        console.log(req)
        // Check for errors and log them if they exist.
        if (err) reject(err)
        // Else send the meeting link.
        resolve({ code: 200, link: req.data.hangoutLink, msg: "Created!" })
      }
    )
  })
}
