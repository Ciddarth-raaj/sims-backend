// Require google from googleapis package.
const { google } = require('googleapis')

// Require oAuth2 from our google instance.
const { OAuth2 } = google.auth

// Create a new instance of oAuth and set our Client ID & Client Secret.
const oAuth2Client = new OAuth2(
    '156374965130-mmgtjkm9bu2vmq40dt83919orld14nde.apps.googleusercontent.com',
    'HDnHtnH05ypZwpVmvGRABEuj'
)

// Call the setCredentials method on our oAuth2Client instance and set our refresh token.
oAuth2Client.setCredentials({
    refresh_token: '1//04gvvc8zri5gHCgYIARAAGAQSNwF-L9Ir2dH8W8hW3ES6drbx5te7b71mWHO-AYdoy_eKy2GGrPRvdqaF5t1LKws5TEF7TjldBfg',
})

// Create a new calender instance.
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client })

function createEvent(appointment_id, eventStartTime, eventEndTime, summary, description, attendees) {
    return new Promise((resolve, reject) => {
        const event = {
            summary: summary,
            description: description,
            start: {
                dateTime: eventStartTime,
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: eventEndTime,
                timeZone: 'Asia/Kolkata',
            },
            attendees: attendees,
            conferenceData: {
                createRequest: {
                    requestId: "appointment_" + appointment_id,
                    conferenceSolutionKey: {
                        type: "hangoutsMeet"
                    }
                }
            },
        }

        // Check if we a busy and have an event on our calendar for the same time.
        calendar.freebusy.query(
            {
                resource: {
                    timeMin: eventStartTime,
                    timeMax: eventEndTime,
                    timeZone: 'Asia/Kolkata',
                    items: [{ id: 'primary' }],
                },
            },
            async (err, res) => {
                // Check for errors in our query and log them if they exist.
                if (err) reject(err)

                // Create an array of all events on our calendar during that time.
                const eventArr = res.data.calendars.primary.busy

                // Check if event array is empty which means we are not busy
                if (eventArr.length === 0) {
                    return calendar.events.insert(
                        { calendarId: 'primary', resource: event, conferenceDataVersion: '1', sendUpdates: "all", },
                        (err, req) => {
                            // Check for errors and log them if they exist.
                            if (err) reject(err)
                            // Else send the meeting link.
                            resolve({ code: 200, link: req.data.hangoutLink, msg: "Created!" })
                        }
                    )
                }

                // If event array is not empty log that we are busy.
                resolve({ code: 201, msg: "User busy!" })
            }
        )
    })
}