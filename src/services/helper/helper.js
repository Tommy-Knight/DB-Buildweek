import { profile } from "../db/db.js";
import { promisify } from "util";
import fs from "fs-extra";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { pipeline } from "stream";
import PdfPrinter from "pdfmake";

const asyncPipeLine = promisify(pipeline);
export const generatePDFStream = async (data) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [data],
  };

  const options = {
    // ...
  };

  const pdfReadableStream = printer.createPdfKitDocument(
    docDefinition,
    options
  );
  pdfReadableStream.end();
  const path = join(dirname(fileURLToPath(import.meta.url)), "mypdf.pdf");
  const destination = fs.createWriteStream(path);
  await asyncPipeLine(pdfReadableStream, destination);
};
