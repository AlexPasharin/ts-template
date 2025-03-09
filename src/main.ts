import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

import config from './config';
import { getTwoLevelsHeaders } from './utils/sheets';

// import { google } from "googleapis";

/*
  load test document and attempt to print the value of the cell in first row and first column in the tab named "Pages to generate"
*/
try {
  await processDocument();
} catch (err) {
  console.error(err);
}

async function loadDocument(): Promise<GoogleSpreadsheet> {
  const { documentId, client_email, private_key } = config;

  const jwt = new JWT({
    email: client_email,
    key: private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // const sheets = google.sheets({ version: "v4", auth: jwt });
  // const sheet = await sheets.spreadsheets
  //   .get({ spreadsheetId: documentId })
  //   .then((data) => data.data.sheets);
  // console.log({ sheet });

  const doc = new GoogleSpreadsheet(documentId, jwt);

  try {
    await doc.loadInfo();

    return doc;
  } catch (err) {
    if (err !== null && typeof err === 'object' && 'status' in err) {
      const { status } = err;

      if (status === 404) {
        throw Error(`Google sheet with id ${documentId} not found`);
      }

      if (status === 403) {
        throw Error(
          `You don't have permission to access Google sheet with id ${documentId}`
        );
      }

      console.error(`Error status:`, status);
    }

    if (err instanceof Error) {
      throw Error(err.message);
    }

    throw err;
  }
}

async function processDocument() {
  const document = await loadDocument();

  const PAGES_TO_GENERATE = '[NEW] Pages to generate - Togather 1';
  const pagesToGenerateSheet = document.sheetsByTitle[PAGES_TO_GENERATE];

  if (!pagesToGenerateSheet) {
    throw Error(
      `Document does not contain a sheet named ${PAGES_TO_GENERATE} `
    );
  }

  await getTwoLevelsHeaders(pagesToGenerateSheet);

  //   const { columnCount } = pagesToGenerateSheet;

  //   // await pagesToGenerateSheet.loadHeaderRow(2);

  //   // const rows = await pagesToGenerateSheet.getRows();
  //   // const firstRow = rows[0];

  //   // console.log(firstRow);

  //   // // const cellC3 = pagesToGenerateSheet.get

  //   await pagesToGenerateSheet.loadCells({
  //     startRowIndex: 0,
  //     endRowIndex: 2,
  //   });

  //   const firstLevelHeaders: {
  //     startingColumnIdx: number;
  //     value: string;
  //     subheaders: string[];
  //   }[] = [];

  //   for (let i = 0; i < columnCount; i++) {
  //     const value = getCellValue({ rowIndex: 0, columnIndex: i });

  //     if (value) {
  //       firstLevelHeaders.push({ startingColumnIdx: i, value, subheaders: [] });
  //     }
  //   }

  //   firstLevelHeaders.forEach((firstLevelHeader, idx) => {
  //     const nextFirstLevelHeader = firstLevelHeaders.at(idx + 1);
  //     const endingIdx = nextFirstLevelHeader?.startingColumnIdx ?? columnCount;

  //     for (let j = firstLevelHeader.startingColumnIdx; j < endingIdx; j++) {
  //       const value = getCellValue({ rowIndex: 1, columnIndex: j });

  //       if (value) {
  //         firstLevelHeader.subheaders.push(value);
  //       }
  //     }
  //   });

  //   console.log(JSON.stringify(firstLevelHeaders, null, 4));

  //   // prints the value of the cell in first row and first column
}
