import { ParsedArticle } from 'readability';
import { IFictionDetails } from './getFictionDetails';
import aboutReaderCSS from './aboutReaderCSS';

const pageBreakHTML = `
<p style="page-break-after: always;">&nbsp;</p>
<p style="page-break-before: always;">&nbsp;</p>
`;

export const chapterHTMLTemplate = (
  chapterUrl: string,
  article: ParsedArticle,
) => `
    ${pageBreakHTML}
    <div class="root light sans-serif loaded">
      <div class="header reader-header reader-show-element">
        <a class="domain reader-domain" href="${chapterUrl}">${chapterUrl}</a>
        <div class="domain-border"></div>
        <h1 class="reader-title">${article.title}</h1>
        <div class="credits reader-credits">${article.excerpt}</div>
        <div class="meta-data">
          <div class="reader-estimated-time">${article.length}</div>
        </div>
      </div>
      <hr>
      <div class="content">
        <div class="moz-reader-content line-height4 reader-show-element">
          ${article.content}
        </div>
      </div>
    </div>
    `;

export const fictionHTMLTemplate = (
  { fictionName, authorName, fictionUrl }: IFictionDetails,
  allChaptersHTML: string[],
) => `
    <html>
      <head>
        <style>
          ${aboutReaderCSS}
        </style>
      </head>
      <body>
        <h1>${fictionName}</h1>
        <h2>${authorName}</h2>
        <a class="domain reader-domain" href="${fictionUrl}">${fictionUrl}</a>
        <hr>
        ${allChaptersHTML.join('')}
      </body>
    </html>
  `;
