'use strict'

var cheerio = require('cheerio')

// Given a body of a full chapter page, return the important content
function makeChapterHTML (body, firstChapter) {
  let $ = cheerio.load(body)

  // Construct a new dom element
  var chapterHTML = $('<div>')
    .append(
      // Add the chapter contents
      $('.chapter-content')
      .clone()
      .addClass('page')
      // Add chapter name & book name
      .prepend($.html('div.page-container div div div h2')) // Chapter Name
  )

  if (firstChapter) {
    chapterHTML
      .prepend($.html('div.page-container div div div h1')) // Title & Author
      .prepend(`<link rel='stylesheet' href="file://${__dirname}/rrl-styling.css"/>`)
  }

  return chapterHTML.html()
}

module.exports = {
  makeChapterHTML: makeChapterHTML
}
