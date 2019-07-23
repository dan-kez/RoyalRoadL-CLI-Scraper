declare module 'readability' {
  interface ParsedArticle {
    // article title
    title: string;
    // author metadata
    byline:string;
    // content direction
    dir: string;
    // HTML string of processed article content 
    content: string;
    // Article content
    textContent: string;
    // length of an article, in characters
    length: string;
    // article description, or short excerpt from the content
    excerpt: string;
    // The website name where the content came from
    siteName: string;
  }

  interface ReadabilityOptions {
    debug?: boolean;
    maxElemsToParse?: number;
    nbTopCandidates?: number;
    charThreshold?: number
    classesToPreserve?: string[];
  }

  /**
   * A standalone version of the readability library used for Firefox Reader View.
   */
  export default class Readability {
    constructor(doc: HTMLDocument, options?: ReadabilityOptions);

    /**
     * Runs readability.
     */
    parse(): ParsedArticle;
  }
}
  