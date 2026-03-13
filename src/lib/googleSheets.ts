import { google } from 'googleapis';

export const getGoogleSheets = async () => {
  let authOptions: any = {
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  };

  // Vercel 등 배포 환경: 환경 변수에 저장된 JSON 문자열 사용
  if (process.env.GOOGLE_CREDENTIALS) {
    authOptions.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  } 
  // 로컬 환경: 파일 경로 사용
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    authOptions.keyFile = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  } else {
    throw new Error('Google Credentials API key is missing.');
  }

  const auth = new google.auth.GoogleAuth(authOptions);

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client as any });
  return sheets;
};

export const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
