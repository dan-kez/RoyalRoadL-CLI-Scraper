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
  .arguments('<chapterID>')
  .description('Generate a PDF for a given Chapter ID')
  .parse(process.argv)

var chapterID = program.args[0]

if (!chapterID) {
  console.error('Chapter ID is required')
  process.exit(1)
}

var url = 'http://royalroadl.com/fiction/chapter/' + chapterID
console.log(`Pulling Chapter from ${url}`)

var defaultRequest = request.defaults({headers: {'User-Agent': 'Mozilla/5.0'}})
defaultRequest(url)
  .spread((response, body) => {
    if (response.statusCode === 200) {
      let $ = cheerio.load(body)

      var title = $('div.page-container div div div h1').first().text()
      var chapter = $('div.page-container div div div h2').first().text()
      var chapterHTML = makeChapterHTML(body, true)

      var filename = `${title}_-_${chapter}`.replace(/ /g, '_')

      // Make the html page
      fs.writeFile(`${process.cwd()}/${filename}.html`, chapterHTML, function (err) {
        if (err) return console.log(err)
        console.log(`Created HTML at ${process.cwd()}/${filename}.html`)
      })

      // Make the pdf
      pdf.create(chapterHTML, pdfConf).toFile(`${process.cwd()}/${filename}.pdf`, function (err, res) {
        if (err) return console.log(err)
        console.log(`Created PDF at ${res.filename}`)
      })
    }
  })
  .catch((err) => {
    console.log(err.message)
    console.log('Are you sure your ID is correct?')
  })
