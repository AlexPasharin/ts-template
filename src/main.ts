import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import config from "./config.ts";

/*
  load test document and attempt to print the value of the cell in first row and first column in the tab named "Pages to generate"
*/
processDocument().catch((err: unknown) => {
  console.error(err);
});

async function loadDocument(): Promise<GoogleSpreadsheet> {
  const { documentId, client_email, private_key } = config;

  const jwt = new JWT({
    email: client_email,
    key: private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(documentId, jwt);

  try {
    await doc.loadInfo();

    return doc;
  } catch (err) {
    if (err !== null && typeof err === "object" && "status" in err) {
      const { status } = err;

      if (status === 404) {
        throw Error(`Google sheet with id ${documentId} not found`);
      }

      if (status === 403) {
        throw Error(
          `You don't have permission to access Google sheet with id ${documentId}`,
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

const PAGES_TO_GENERATE = "Pages to generate";

async function processDocument() {
  const document = await loadDocument();

  const pagesToGenerateSheet = document.sheetsByTitle[PAGES_TO_GENERATE];

  if (!pagesToGenerateSheet) {
    throw Error(
      `Document does not contain a sheet named ${PAGES_TO_GENERATE} `,
    );
  }

  await pagesToGenerateSheet.loadCells();

  const cell = pagesToGenerateSheet.getCell(0, 0);
  console.log(cell.value); // prints the value of the cell in first row and first column
}
