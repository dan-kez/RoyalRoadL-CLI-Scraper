const { JSDOM } = require('jsdom');
const Readability = require('readability');
const ProgressBar = require('progress');
const { minify } = require('html-minifier');
const { chapterHTMLTemplate, fictionHTMLTemplate } = require('./htmlTemplates');

const MAX_RETRY = 5;

const getDomWithRetry = async (url, retryCount = 0) => {
  try {
    return await JSDOM.fromURL(url);
  } catch (e) {
    if (retryCount < MAX_RETRY) {
      console.warn(`Failed to get url, ${url}. Retry count ${retryCount}/${MAX_RETRY}`);
      return new Promise(resolve => setTimeout(
        () => resolve(getDomWithRetry(url, retryCount + 1),
          100 * retryCount),
      ));
    }
    console.error(`Permanently failed to get url, ${url}.`);
    throw e;
  }
};

// Get the high level fiction details and the chapter list
const getFictionDetails = async (fictionId) => {
  console.log(`Fetching fiction details for fictionId: ${fictionId}`);

  const fictionUrl = `http://royalroadl.com/fiction/${fictionId}`;
  try {
    const dom = await getDomWithRetry(fictionUrl);
    const { document } = dom.window;
    return {
      fictionUrl,
      fictionName: document.querySelector('.fic-header h1[property="name"]').innerHTML,
      authorName: document.querySelector('.fic-header h4[property="author"] [property="name"]').textContent.trim(),
      chapterUrls: Array.from(document.querySelectorAll('table#chapters tbody tr')).map(elem => `http://royalroadl.com${elem.getAttribute('data-url')}`),
    };
  } catch (e) {
    console.error(e);
    process.exit();
  }
  return {};
};

// Fetch the html for a given chapter url and render the readable version
const getChapterHTML = async (chapterURL) => {
  try {
    const dom = await getDomWithRetry(chapterURL);
    const article = new Readability(dom.window.document).parse();
    return chapterHTMLTemplate(chapterURL, {
      title: article.title,
      excerpt: article.excerpt,
      length: article.length,
      content: article.content,
    });
  } catch (e) {
    console.error(e);
    return `Error loading chapter URL - ${chapterURL}`;
  }
};

// Fetch all chapters in parallel with a progress bar
const getAllChaptersHTML = async (chapterURLs) => {
  const bar = new ProgressBar(
    '  Rendering chapters [:bar] | :rate chapters/sec | :percent | :etas',
    { total: chapterURLs.length, width: 40 },
  );
  const allChaptersHTML = await Promise.all(chapterURLs.map(async (chapterURL) => {
    const chapterHTML = await getChapterHTML(chapterURL);
    bar.tick();
    return chapterHTML;
  }));
  return allChaptersHTML;
};

// Generate the full fiction HTML.
const processFictionId = async (fictionId) => {
  const fictionDetails = await getFictionDetails(fictionId);
  const allChaptersHTML = await getAllChaptersHTML(fictionDetails.chapterUrls);

  const fictionHTML = fictionHTMLTemplate(fictionDetails, allChaptersHTML);

  return {
    ...fictionDetails,
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

module.exports = processFictionId;
