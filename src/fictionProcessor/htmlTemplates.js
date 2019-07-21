const path = require('path');
const fs = require('fs');

const readerCSS = fs.readFileSync(path.resolve(__dirname, './aboutReader.css'), 'utf8');

const pageBreakHTML = `
<p style="page-break-after: always;">&nbsp;</p>
<p style="page-break-before: always;">&nbsp;</p>
`;

module.exports = {
  chapterHTMLTemplate: (chapterUrl, {
    title, excerpt, length, content,
  }) => `
    ${pageBreakHTML}
    <div class="root light sans-serif loaded">
      <div class="header reader-header reader-show-element">
        <a class="domain reader-domain" href="${chapterUrl}">${chapterUrl}</a>
        <div class="domain-border"></div>
        <h1 class="reader-title">${title}</h1>
        <div class="credits reader-credits">${excerpt}</div>
        <div class="meta-data">
          <div class="reader-estimated-time">${length}</div>
        </div>
      </div>
      <hr>
      <div class="content">
        <div class="moz-reader-content line-height4 reader-show-element">
          ${content}
        </div>
      </div>
    </div>
    `,
  fictionHTMLTemplate: ({ fictionName, authorName, fictionUrl }, allChaptersHTML) => `
    <html>
      <head>
        <style>
          ${readerCSS}
        </style>
      </head>
      <body>
        <h1>${fictionName}</h1>
        <h2>${authorName}</h2>
        <a class="domain reader-domain" href="${fictionUrl}">${fictionUrl}</a>
        <hr>
        ${allChaptersHTML}
      </body>
    </html>
  `,
};
