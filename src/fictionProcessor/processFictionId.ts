import Readability from 'readability';
import ProgressBar from 'progress';
import { minify } from 'html-minifier';
import { chapterHTMLTemplate, fictionHTMLTemplate } from './htmlTemplates';
import getDOMWithRetry from './getDOMWithRetry';
import getFictionDetails from './getFictionDetails';

// Fetch the html for a given chapter url and render the readable version
const getChapterHTML = async (chapterURL: string) => {
  try {
    const dom = await getDOMWithRetry(chapterURL);
    const article = new Readability(dom.window.document).parse();
    return chapterHTMLTemplate(chapterURL, article);
  } catch (e) {
    console.error(e);
    return `Error loading chapter URL - ${chapterURL}`;
  }
};

// Fetch all chapters in parallel with a progress bar
const getAllChaptersHTML = async (chapterURLs: string[]) => {
  const bar = new ProgressBar(
    '  Rendering chapters [:bar] | :rate chapters/sec | :percent | :etas',
    { total: chapterURLs.length, width: 40 },
  );
  const allChaptersHTML = await Promise.all(
    chapterURLs.map(async chapterURL => {
      const chapterHTML = await getChapterHTML(chapterURL);
      bar.tick();
      return chapterHTML;
    }),
  );
  return allChaptersHTML;
};

// Generate the full fiction HTML.
const processFictionId = async (fictionId: string) => {
  const fictionDetails = await getFictionDetails(fictionId);
  const allChaptersHTML = await getAllChaptersHTML(fictionDetails.chapterUrls);

  const fictionHTML = fictionHTMLTemplate(fictionDetails, allChaptersHTML);

  return {
    fictionDetails,
    fictionHTML: minify(fictionHTML, {
      useShortDoctype: true,
      minifyCSS: true,
      removeComments: true,
      removeTagWhitespace: true,
      removeAttributeQuotes: true,
      removeEmptyElements: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
    }),
  };
};

export default processFictionId;
