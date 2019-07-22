>NOTE: Any use of this project is solely at the end user's discretion. The author(s) claim no responsibility for end user's actions with this tool.

# RoyalRoadL-Scraper
A basic downloader of novels from royalroadl.com.

This package uses mozilla's [readability](https://github.com/mozilla/readability) package to parse a fiction into a reader mode and save the content in html and as a PDF. 

There are a lot of niceties that could be implemented. Additional parameters for formatting, splitting up the pdfs into multiple files, caching, etc. However this is more or less just a quick, dirty, and lightweight way to save some novels offline.

## Installation
```
npm install -g rrl-scraper
```

The CLI should now be accessible via command `rrl-scraper`

## Usage
For general usage run command `rrl-scraper help`.

Both id's can be found in RRL's url.

- `rrl-scraper <fictionID | fictionURL>` - Generates a compiled PDF & HTML file of all chapters for the given fiction.
  - `http://royalroadl.com/fiction/9179` - 9179 is the *fictionID*

```
Usage: rrl-scraper [options] <fiction>

Generate a pdf & html version of a fiction from RoyalRoadl.com. Provide a fiction id or url as the main argument.

Options:
  -V, --version            output the version number
  --no-pdf                 Do not generate a pdf file
  -o, --output-dir [path]  The directory to output generated files. Defaults to current directory.
  --no-create-subdir       Do not create a sub directory in chosen output directory for the generated files.
  -h, --help               output usage information
```

### Example Commands
```bash
# Downloads Epilogue to ~/Documents/Novels/epilogue_21374
rrl-scraper -o ~/Documents/Novels https://www.royalroad.com/fiction/21374/epilogue

# Downloads Epilogue but does not make a pdf in the directory the command was run in
rrl-scraper --no-pdf 21374

# Downloads Epilogue (via fiction id) to  ~/Documents/Novels/epilogue_21374
rrl-scraper -o ~/Documents/Novels 21374
```

## Development
Feel free to make improvements and submit a PR!
