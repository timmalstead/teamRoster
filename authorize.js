/**
 * based on code at
 *
 * https://github.com/gsuitedevs/node-samples/blob/master/sheets/quickstart/index.js
 *
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fs = require("fs")
const readline = require("readline")
const { google } = require("googleapis")

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
const TOKEN_PATH = "token.json"

require("dotenv").config()

authorize(process.env, listMajors)

function authorize(credentials, callback) {
  const { CLIENT_SECRET, CLIENT_ID, REDIRECT_URI } = credentials
  const oAuth2Client = new google.auth.OAuth2({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  })
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback)
    oAuth2Client.setCredentials(JSON.parse(token))
    callback(oAuth2Client)
  })
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  })
  console.log("Authorize this app by visiting this url:", authUrl)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close()
    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error("Error while trying to retrieve access token", err)
      oAuth2Client.setCredentials(token)
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err)
        console.log("Token stored to", TOKEN_PATH)
      })
      callback(oAuth2Client)
    })
  })
}

function listMajors(auth) {
  const sheets = google.sheets({ version: "v4", auth })
  sheets.spreadsheets.values.get(
    {
      spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      range: "Class Data!A2:E",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err)
      const rows = res.data.values
      if (rows.length) {
        console.log("Name, Major:")
        rows.map((row) => {
          console.log(`${row[0]}, ${row[4]}`)
        })
      } else {
        console.log("No data found.")
      }
    }
  )
}
