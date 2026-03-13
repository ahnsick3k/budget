import { google } from 'googleapis';

export const getGoogleSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });
  return sheets;
};

export const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
