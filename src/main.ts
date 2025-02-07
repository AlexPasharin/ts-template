import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

// const GOOGLE_API_KEY = "AIzaSyA023oBrOAFWdFTSAYkL9mKci_61TFhE0w"
const DOCUMENT_ID = "19LOqkWDuoQ6KCXVAORj5brv_1WvwWT2pSE1SNEE39X0";

const loadDocument = async (): Promise<GoogleSpreadsheet | void> => {
  const client_email = process.env["GOOGLE_CLIENT_EMAIL"];
  const private_key = process.env["GOOGLE_PRIVATE_KEY"];

  if (!client_email || !private_key) {
    throw Error("Client email and google private key not found, terminating");
  }

  const jwt = new JWT({
    email: client_email,
    key: private_key,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(DOCUMENT_ID, jwt);

  return doc
    .loadInfo()
    .then(() => doc)
    .catch(() => {
      // const message = err?.message;
      // if (code === 404) {
      //   throw Error(`Google sheet with id ${DOCUMENT_ID} not found`)
      // }
      // if (code === 403) {
      //   throw Error(
      //     `You don't have permission to access Google sheet with id ${DOCUMENT_ID}`
      //   )
      // }
      // throw err
    });
};

const PAGES_TO_GENERATE = "Pages to generate";

const processDocument = async () => {
  const document = await loadDocument();

  if (!document) {
    return;
  }

  const pagesToGenerateSheet = document.sheetsByTitle[PAGES_TO_GENERATE];

  if (!pagesToGenerateSheet) {
    throw Error(
      `Document does not contain a sheet named ${PAGES_TO_GENERATE} `,
    );
  }

  await pagesToGenerateSheet.loadCells();
  // await pagesToGenerateSheet.loadHeaderRow()

  // const rows = await pagesToGenerateSheet.getRows()
  // //console.log(rows)
  // console.log(rows[0].get("Vertical"))

  const cell = pagesToGenerateSheet.getCell(0, 0);
  console.log(cell.value);
};

processDocument().catch(() => {});

// function lookupHeadphonesManufacturer(color: "blue" | "black"): string {
//   if (color === "blue") {
//     return "beats"
//   } else {
//     ;("bose")
//   }
// }

// const x = lookupHeadphonesManufacturer("black")

// interface EnvironmentVars {
//   NAME: string
//   OS: string

//   // Unknown properties are covered by this index signature.
//   [propName: string]: string
// }

// declare const env: EnvironmentVars

// // Declared as existing
// const sysName = env.NAME
// const os = env.OS

// const nodeEnv = env.NODE_ENV

// nodeEnv.length
