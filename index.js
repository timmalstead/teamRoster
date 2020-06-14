const { google } = require("googleapis")
const express = require("express")()
require("dotenv").config()
const p = process.env

express.get("/", async (request, response) => {
  const auth = new google.auth.OAuth2(p.CLIENT_ID, p.CLIENT_SECRET)
  auth.setCredentials({ refresh_token: p.REFRESH_TOKEN })

  const sheets = google.sheets({ version: "v4", auth })

  const rosterSheet = await sheets.spreadsheets.get({
    spreadsheetId: p.SPREADSHEET_ID,
    includeGridData: true,
  })

  const rowData = rosterSheet.data.sheets[0].data[0].rowData
  const fV = "formattedValue"
  const n = "None"
  const teamData = rowData.reduce((arr, data, i) => {
    const dV = data.values
    if (i > 0 && dV[8][fV] === "Active")
      arr.push({
        fullName: dV[0][fV] || n,
        firstName: dV[1][fV] || n,
        lastName: dV[2][fV] || n,
        role: dV[3][fV] || n,
        email: dV[4][fV] || n,
        gitHub: dV[6][fV] || n,
        picture: dV[7][fV] || n,
      })
    return arr
  }, [])

  response.json({
    status: {
      code: rosterSheet.status,
      statusText: rosterSheet.statusText,
    },
    message: "Roster Sucessfully Retrieved from Google Sheets",
    data: teamData,
  })
})

express.listen(p.PORT, () =>
  console.log(`Express Server Running on port ${p.PORT}`)
)
