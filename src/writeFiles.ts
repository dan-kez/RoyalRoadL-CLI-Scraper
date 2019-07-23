import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';
import pdfConf from './pdf-conf.json';

const writeFile = promisify(fs.writeFile);

const writePDF = (html: string, filepath: string): Promise<void> =>
  new Promise((resolve, reject) => {
    pdf.create(html, pdfConf).toFile(filepath, (err, result) => {
      if (err) {
        reject(err);
      }
      console.log(`Created PDF at ${result.filename}`);
      resolve();
    });
  });
const writeHTML = async (html: string, filepath: string) => {
  await writeFile(filepath, html);
  console.log(`Created HTML file ${filepath}`);
};

const makeFilename = (inputString: string) =>
  inputString.replace(/[^a-z0-9]/gi, '_').toLowerCase();

const determineBaseDirectory = (
  filename: string,
  outputDir = process.cwd(),
  createSubdir: boolean,
) => {
  if (!fs.existsSync(outputDir)) {
    // We could automatically create the directory but that may be unexpected for some users
    console.error(
      'The specified output directory does not exist. Please create it and rerun',
    );
  }
  if (createSubdir) {
    const subdirPath = path.resolve(outputDir, filename);

    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath);
    }
    return subdirPath;
  }
  return outputDir;
};

interface IWriteFilesOptions {
  shouldGeneratePDF: boolean;
  outputDir?: string;
  createSubdir: boolean;
}

const writeFiles = async (
  fictionHTML: string,
  fictionId: string,
  fictionName: string,
  { shouldGeneratePDF, outputDir, createSubdir }: IWriteFilesOptions,
) => {
  const filename = makeFilename(`${fictionName}_${fictionId}`);
  const baseDirectory = determineBaseDirectory(
    filename,
    outputDir,
    createSubdir,
  );

  await Promise.all([
    shouldGeneratePDF
      ? writePDF(fictionHTML, path.resolve(baseDirectory, `${filename}.pdf`))
      : Promise.resolve(),
    writeHTML(fictionHTML, path.resolve(baseDirectory, `${filename}.html`)),
  ]);

  console.log('Finished writing all files.');
};

export default writeFiles;
