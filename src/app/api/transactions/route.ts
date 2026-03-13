import { NextResponse } from 'next/server';
import { getGoogleSheets, SPREADSHEET_ID } from '@/lib/googleSheets';
import { v4 as uuidv4 } from 'uuid';

async function getFirstSheetName(sheets: any /* eslint-disable-line */) {
  const info = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  return info.data.sheets?.[0]?.properties?.title || 'Sheet1';
}

export async function GET() {
  try {
    const sheets = await getGoogleSheets();
    const sheetName = await getFirstSheetName(sheets);
    const range = `${sheetName}!A:G`;
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ transactions: [] });
    }

    // Skip header row
    const transactions = rows.slice(1).map((row) => ({
      id: row[0],
      date: row[1],
      type: row[2], // 'income' | 'expense'
      category: row[3],
      amount: Number(row[4]),
      memo: row[5] || '',
      paymentMethod: row[6] || '기본', // Handle missing historical data 
    }));

    // Return descending order
    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ transactions });
  } catch (error: any /* eslint-disable-line */) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Support bulk insertion for CSV upload
    const transactions = Array.isArray(body) ? body : [body];
    const rowsToInsert = transactions.map(tx => {
      const id = uuidv4();
      return [id, tx.date, tx.type, tx.category, tx.amount, tx.memo || '', tx.paymentMethod || '기본'];
    });

    const sheets = await getGoogleSheets();
    const sheetName = await getFirstSheetName(sheets);
    const headerRange = `${sheetName}!A1:G1`;
    const dataRange = `${sheetName}!A:G`;

    // Check header
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: headerRange,
    });

    let hasHeader = false;
    let headerFields: string[] = [];
    if (response.data.values && response.data.values.length > 0) {
      hasHeader = true;
      headerFields = response.data.values[0];
    }
    
    if (!hasHeader || headerFields.length < 7) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: headerRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [['ID', 'Date', 'Type', 'Category', 'Amount', 'Memo', 'Payment Method']],
        },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: dataRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: rowsToInsert,
      },
    });

    return NextResponse.json({ message: 'Transaction(s) added successfully', count: rowsToInsert.length });
  } catch (error: any /* eslint-disable-line */) {
    console.error('Error adding transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idToDelete = searchParams.get('id');

    if (!idToDelete) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const sheets = await getGoogleSheets();
    const sheetName = await getFirstSheetName(sheets);
    const dataRange = `${sheetName}!A:G`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: dataRange,
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json({ error: 'No data found' }, { status: 404 });

    const rowIndex = rows.findIndex((row) => row[0] === idToDelete);

    if (rowIndex === -1) {
       return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Sheet row numbers are 1-based. And array index is 0-based.
    // Also, if header is row 1, then array index 1 is row 2.
    // So rowIndex + 1 is the actual sheet row number.
    const rowToDelete = rowIndex + 1;

    // get sheetId (gid)
    const info = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheetId = info.data.sheets?.[0]?.properties?.sheetId;

    if (sheetId === undefined) {
      return NextResponse.json({ error: 'Failed to retrieve sheet ID' }, { status: 500 });
    }

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: 'ROWS',
                startIndex: rowToDelete - 1,
                endIndex: rowToDelete,
              },
            },
          },
        ],
      },
    });

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error: any /* eslint-disable-line */) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
