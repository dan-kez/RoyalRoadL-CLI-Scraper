>NOTE: Any use of this project is solely at the end user's discretion. The author(s) claim no responsibility for end user's actions with this tool.

# RoyalRoadL-Scraper
A lightweight screen-scraper to generate pdf renderings of chapters / novels from royalroadl.com.
>NOTE: this is just a basic screen-scraper. If there are significant changes to RRL's DOM then this will break. Should be pretty simple to fix though.

There are a lot of niceties that could be implemented. Additional query parameters for formatting, splitting up the pdfs into multiple files, caching, etc. However this is more or less just a quick, dirty, and lightweight way to save some novels offline.

## Installation
```
git clone https://github.com/dmk255/RoyalRoadL-CLI-Scraper.git
cd RoyalRoadL-CLI-Scraper && npm install -g
```

The CLI should now be accessible via command `rrl-scraper`

## Usage
For general usage run command `rrl-scraper help`.

Both id's can be found in RRL's url.

- `rrl-scraper fiction <fictionID>` - Generates a compiled PDF of all chapters for the given fiction.
  - `http://royalroadl.com/fiction/9179` - 9179 is the *fictionID*
- `rrl-scraper chapter <chapterID>` - Generates a PDF of a single chapter.
  - `http://royalroadl.com/fiction/chapter/75087` - 75087 is the *chapterID*

## Development
Feel free to make improvements!
