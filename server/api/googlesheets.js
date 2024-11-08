// utils/googleSheets.js
import { google } from 'googleapis';

export default  defineEventHandler(async (event) => {
    if (getMethod(event) !== 'POST') return
    const body = await readBody(event)

      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        projectId: process.env.GOOGLE_SHEETS_PROJECT_ID,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
    
      const sheets = google.sheets({ version: 'v4', auth });
      const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
      const range = 'Sheet1!A1'; // Specify your target range here
    
      try {
        const response = await sheets.spreadsheets.values.append({
          spreadsheetId,
          range,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [body],
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error adding row to sheet:', error);
        throw error;
      }
})