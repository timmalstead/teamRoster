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

  response.json(rosterSheet)
})

express.listen(p.PORT, () =>
  console.log(`Express Server Running on port ${p.PORT}`)
)
