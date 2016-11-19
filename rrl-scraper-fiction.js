#!/usr/bin/env node
'use strict'

var program = require('commander')
var Promise = require('bluebird')
var request = Promise.promisify(require('request'), {multiArgs: true})
var pdf = require('html-pdf')
var fs = require('fs')
var cheerio = require('cheerio')

var makeChapterHTML = require('./utils').makeChapterHTML
var pdfConf = require('./pdf-conf.json')

program
  .arguments('<fictionID>')
  .description('Generate a compiled PDF for a given Fiction ID')
  .parse(process.argv)

var fictionID = program.args[0]

if (!fictionID) {
  console.error('Fiction ID is required')
  process.exit(1)
}

var url = 'http://royalroadl.com/fiction/' + fictionID
console.log(`Pulling fiction from ${url}`)

var defaultRequest = request.defaults({headers: {'User-Agent': 'Mozilla/5.0'}})
defaultRequest(url)
  .spread((response, body) => {
    let $ = cheerio.load(body)
    var title = $('div.fic-header h2').first().text()

    // Get all the chapter urls in order.
    var chapterURLs = $('table#chapters tbody').find('tr').map((i, tr) => {
      var url = $(tr).data('url')
      return `http://royalroadl.com${url}`
    })

    // Get all the chapterHTML in the appropriate order
    var chapterHTML = []
    for (var i = 0; i < chapterURLs.length; i++) {
      // Get all chapter contents asyncronously
      chapterHTML[i] = defaultRequest(chapterURLs[i])
        .spread((response, body) => {
          var firstChapter = chapterURLs[0].localeCompare(response.request.href) === 0

          console.log(`Parsing Chapter URL ${response.request.href}`)
          return makeChapterHTML(body, firstChapter)
        })
        .catch((err) => {
          console.log(err)
        })
    }

    // Reduce all the promises and make the pdf
    Promise.map(chapterHTML, (item) => {
      return item // shorter than constructor
    }).reduce((prev, cur) => {
      return prev.concat(cur)
    }).then((allHTML) => {
      var filename = title.replace(/ /g, '_')

      // Make the html page
      fs.writeFile(`${process.cwd()}/${filename}.html`, chapterHTML, function (err) {
        if (err) return console.log(err)
        console.log(`Created HTML at ${process.cwd()}/${filename}.html`)
      })

      // Make the pdf
      pdf.create(allHTML, pdfConf).toFile(`${process.cwd()}/${filename}.pdf`, function (err, res) {
        if (err) return console.log(err)
        console.log(`Created PDF at ${res.filename}`)
      })
    })
    .catch((err) => {
      console.log(err.message)
      console.log('Are you sure your ID is correct?')
    })
  })
  .catch((err) => {
    console.log(err)
  })
