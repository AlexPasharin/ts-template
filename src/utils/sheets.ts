import {
  GoogleSpreadsheetCellErrorValue,
  type GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

export async function getTwoLevelsHeaders(sheet: GoogleSpreadsheetWorksheet) {
  const { columnCount } = sheet;

  await sheet.loadCells({
    startRowIndex: 0,
    endRowIndex: 2,
  });

  const firstLevelHeaders = [...Array(columnCount).keys()].reduce<
    {
      startingColumnIdx: number;
      value: string;
      subheaders: string[];
    }[]
  >((acc, idx) => {
    const value = getCellValue({ sheet, rowIndex: 0, columnIndex: idx });

    if (value) {
      acc.push({ startingColumnIdx: idx, value, subheaders: [] });
    }

    return acc;
  }, []);

  const headers = firstLevelHeaders.map((firstLevelHeader, idx) => {
    const { value, startingColumnIdx } = firstLevelHeader;

    const nextFirstLevelHeader = firstLevelHeaders.at(idx + 1);
    const endingColumnIdx =
      nextFirstLevelHeader?.startingColumnIdx ?? columnCount;

    const subheaders: string[] = [];

    for (let j = firstLevelHeader.startingColumnIdx; j < endingColumnIdx; j++) {
      const subHeaderValue = getCellValue({
        sheet,
        rowIndex: 1,
        columnIndex: j,
      });

      if (subHeaderValue) {
        subheaders.push(subHeaderValue);
      }
    }

    return {
      startingColumnIdx,
      endingColumnIdx,
      value,
      subheaders,
    };
  });

  console.log(JSON.stringify(headers, null, 4));
}

function getCellValue({
  sheet,
  rowIndex,
  columnIndex,
}: {
  sheet: GoogleSpreadsheetWorksheet;
  rowIndex: number;
  columnIndex: number;
}): string | null {
  const { value } = sheet.getCell(rowIndex, columnIndex);

  if (value instanceof GoogleSpreadsheetCellErrorValue) {
    // TODO: PROBABLY SHOULD BE A VALIDATION ERROR, THROWING ERROR FOR NOW
    throw Error(
      `Cell in row ${rowIndex} and column ${columnIndex} contains a google sheet error`,
    );
  }

  /// TODO: WHAT TO DO IF VALUE IS NOT A STRING (CAN ALDO BE NUMBER OR BOOLEAN) - we coarse it to string now
  return value?.toString().trim() ?? null;
}
