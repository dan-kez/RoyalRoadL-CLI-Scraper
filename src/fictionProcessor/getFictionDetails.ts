import { JSDOM } from 'jsdom';
import getDOMWithRetry from './getDOMWithRetry';

export interface IFictionDetails {
  fictionUrl: string;
  fictionName: string;
  authorName: string;
  chapterUrls: string[];
}

// Get the high level fiction details and the chapter list
const getFictionDetails = async (
  fictionId: string,
): Promise<IFictionDetails> => {
  console.log(`Fetching fiction details for fictionId: ${fictionId}`);
  const fictionUrl = `http://royalroadl.com/fiction/${fictionId}`;

  let dom: JSDOM;
  try {
    dom = await getDOMWithRetry(fictionUrl);
  } catch (e) {
    console.error(e);
    process.exit();
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { document } = dom!.window;
  const fictionNameElem = document.querySelector(
    '.fic-header h1[property="name"]',
  );
  const authorNameElem = document.querySelector(
    '.fic-header h4[property="author"] [property="name"]',
  );
  return {
    fictionUrl,
    fictionName: fictionNameElem ? fictionNameElem.innerHTML : 'Unknown Name',
    authorName: authorNameElem
      ? (authorNameElem.textContent || '').trim()
      : 'Unknown Author',
    chapterUrls: Array.from(
      document.querySelectorAll('table#chapters tbody tr'),
    ).map(elem => `http://royalroadl.com${elem.getAttribute('data-url')}`),
  };
};

export default getFictionDetails;
