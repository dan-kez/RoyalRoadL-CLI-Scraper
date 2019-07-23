#!/usr/bin/env node
import program from 'commander';
import fictionProcessor from './fictionProcessor';
import writeFiles from './writeFiles';

const determineFictionId = (fictionIdOrURL: string): string => {
  if (Number.isNaN(Number(fictionIdOrURL))) {
    const matches = fictionIdOrURL.match(/^https?:\/\/.*fiction\/(\d+)\//);
    if (matches) {
      return matches[1];
    }
    console.error(
      'Please supply either a fictionId or a link to a fiction from RoyalRoadL.com',
    );
    program.outputHelp();
    process.exit(1);
  }
  return fictionIdOrURL;
};

process.on('unhandledRejection', r => console.error(r));

interface IProgramOptions {
  pdf: boolean;
  createSubdir: boolean;
  outputDir?: string;
}

program
  .version('0.0.1')
  .description(
    'Generate a pdf & html version of a fiction from RoyalRoadl.com. Provide a fiction id or url as the main argument.',
  )
  .arguments('<fiction>')
  .option('--no-pdf', 'Do not generate a pdf file')
  .option(
    '-o, --output-dir [path]',
    'The directory to output generated files. Defaults to current directory.',
  )
  .option(
    '--no-create-subdir',
    'Do not create a sub directory in chosen output directory for the generated files.',
  )
  .action(
    async (
      fictionIdOrURL: string,
      { pdf: shouldGeneratePDF, outputDir, createSubdir }: IProgramOptions,
    ) => {
      const fictionId = determineFictionId(fictionIdOrURL);
      const {
        fictionDetails: { fictionName },
        fictionHTML,
      } = await fictionProcessor(fictionId);
      writeFiles(fictionHTML, fictionId, fictionName, {
        shouldGeneratePDF,
        outputDir,
        createSubdir,
      });
    },
  )
  .parse(process.argv);

// If no argument is provided display the help text
if (process.argv.length === 2) program.outputHelp();
