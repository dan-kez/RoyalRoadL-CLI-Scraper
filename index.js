#!/usr/bin/env node
'use strict'

const program = require('commander')

program
  .version('0.0.1')
  .description('Generate a pdf given either a Fiction ID or Chapter ID from RoyalRoadl.com')
  .command('fiction <fictionID>', 'Generate a compiled PDF for a given Fiction ID')
  .command('chapter <chapterID>', 'Generate a PDF for a given Chapter ID')
  .parse(process.argv)
