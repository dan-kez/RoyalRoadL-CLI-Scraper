import { JSDOM } from 'jsdom';

const MAX_RETRY = 5;

const getDOMWithRetry = async (url: string, retryCount = 0): Promise<JSDOM> => {
  try {
    return await JSDOM.fromURL(url);
  } catch (e) {
    if (retryCount < MAX_RETRY) {
      console.warn(
        `Failed to get url, ${url}. Retry count ${retryCount}/${MAX_RETRY}`,
      );
      return new Promise<JSDOM>(resolve =>
        setTimeout(
          () => resolve(getDOMWithRetry(url, retryCount + 1)),
          100 * retryCount,
        ),
      );
    }
    console.error(`Permanently failed to get url, ${url}.`);
    throw e;
  }
};

export default getDOMWithRetry;
