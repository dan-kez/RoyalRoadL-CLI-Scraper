const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const pdf = require('html-pdf');
const pdfConf = require('./pdf-conf.json');

const writeFile = promisify(fs.writeFile);

const writePDF = async (html, filepath) => {
  // Make the pdf
  const res = await new Promise((resolve, reject) => {
    pdf.create(html, pdfConf).toFile(filepath, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
  console.log(`Created PDF at ${res.filename}`);
};

const writeHTML = async (html, filepath) => {
  await writeFile(filepath, html);
  console.log(`Created HTML file ${filepath}`);
};

const makeFilename = inputString => inputString.replace(/[^a-z0-9]/gi, '_').toLowerCase();

const determineBaseDirectory = (filename, outputDir = process.cwd(), createSubdir) => {
  if (!fs.existsSync(outputDir)) {
    // We could automatically create the directory but that may be unexpected for some users
    console.error('The specified output directory does not exist. Please create it and rerun');
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

const writeFiles = async (
  fictionHTML, fictionId, fictionName, shouldGeneratePDF,
  outputDir, createSubdir,
) => {
  const filename = makeFilename(`${fictionName}_${fictionId}`);
  const baseDirectory = determineBaseDirectory(filename, outputDir, createSubdir);

  await Promise.all([
    shouldGeneratePDF ? writePDF(fictionHTML, path.resolve(baseDirectory, `${filename}.pdf`)) : Promise.resolve,
    writeHTML(fictionHTML, path.resolve(baseDirectory, `${filename}.html`)),
  ]);

  console.log('Finished writing all files.');
};

module.exports = writeFiles;
